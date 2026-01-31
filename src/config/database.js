const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://namstedev:EfiaJAU4PEJgHtPB@namstenodejs.uo03xgr.mongodb.net/",
      { dbName: "namstedev" }
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;
