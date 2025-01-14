const { shareTask } = require("../../src/controllers/taskController");
const connectToMongo = require("../../src/db/db");
const initMiddleware = require("../../lib/initMiddleware");
const Cors = require("cors");
const authMiddleware = require("../../src/middleware/authMiddleware");

const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: process.env.CLIENT_URL,
  credentials: true,
});

const runMiddleware = initMiddleware(cors);

const authenticate = async (req, res) => {
  try {
    await authMiddleware(req, res, () => {});
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default async function handler(req, res) {
  await runMiddleware(req, res);

  if (req.method === "POST") {
    await connectToMongo();
    await authenticate(req, res);
    await shareTask(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
