const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
  const { title, description, status, sharedWith } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status,
      owner: req.user._id,
      sharedWith,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Error in creating task:", error.message);
    res.status(500).send("Server error");
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ owner: req.user._id }, { sharedWith: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    res.json(tasks);
  } catch (error) {
    console.error("Error in getTasks:", error.message);
    res.status(500).send("Server error");
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.owner._id.toString() === req.user._id.toString();
    const isSharedWith = task.sharedWith.some(
      (user) => user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error.message);
    res.status(500).send("Server error");
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, sharedWith } = req.body;

  try {
    let task = await Task.findById(taskId)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.owner._id.toString() === req.user._id.toString();
    const isSharedWith = task.sharedWith.some(
      (user) => user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (sharedWith && !isOwner) {
      return res
        .status(403)
        .json({ message: "Only the owner can modify shared users" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (sharedWith && isOwner) task.sharedWith = sharedWith;

    await task.save();

    task = await Task.findById(taskId)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    res.json(task);
  } catch (error) {
    console.error("Error in updateTask:", error.message);
    res.status(500).send("Server error");
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.remove();

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Error in deleteTask:", error.message);
    res.status(500).send("Server error");
  }
};

const shareTask = async (req, res) => {
  const taskId = req.params.id;
  const { email } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({ message: "User to share with not found" });
    }

    if (userToShare._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot share task with yourself" });
    }

    if (task.sharedWith.includes(userToShare._id)) {
      return res
        .status(400)
        .json({ message: "Task already shared with this user" });
    }

    task.sharedWith.push(userToShare._id);

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    res.json({ message: "Task shared successfully", task: updatedTask });
  } catch (error) {
    console.error("Error in shareTask:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  shareTask,
};
