// server.js
const express = require("express");
const connectDB = require("./config/database"); // Ensure the database is connected
const app = express();
const User = require("./models/user"); // Import the User model



const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());



const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });
