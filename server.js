const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./src/db/db");

dotenv.config();

connectToMongo();
const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${PORT}`);
});
