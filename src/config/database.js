const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI:", process.env.DB_CONNECTION_SECRET); // 
    await mongoose.connect(
     (process.env.DB_CONNECTION_SECRET),
      { dbName: "namstedev" }
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;
