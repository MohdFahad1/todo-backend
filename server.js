const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToMongo = require("./src/db/db");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config();

connectToMongo();

const PORT = process.env.PORT || 5000;

const app = express();

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${PORT}`);
});
