const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGODB_URI; //"mongodb://localhost:27017/zawajlink"; //process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/zawajlink");
    // 🟢 Visual Anchor: Success Log
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    // 🔴 Visual Anchor: Error Log
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Stop the server if the database fails
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = {
  connectDb
};
