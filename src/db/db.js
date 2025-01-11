const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(
      mongoURI,
      console.log("MongoDB connected successfully")
    );
  } catch (error) {
    console.error("Error connecting mongoDB:", error);
  }
};

module.exports = connectToMongo;
