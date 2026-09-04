const mongoose = require("mongoose");

const getMongoUri = () => process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("MongoDB connection failed: MONGO_URI/MONGODB_URI is not set.");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;