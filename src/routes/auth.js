const express = require('express');

const authRouter = express.Router()
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const jwt = require("jsonwebtoken");









authRouter.post("/signup", async (req, res) => {
  try {
    //validate of the data
    validateSignUpData(req);

    //Encrypt the password before saving it to the database
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("Use added successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).send("Email and Password are required");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Email ID does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      
      return res.status(401).send("Password is not valid");
    }

    // ✅ Create JWT token
    const token =  jwt.sign({ userId: user._id }, "mySecretKey", { expiresIn: "7d" });

    // ✅ Send cookie in response
    res.cookie("token", token, {
      httpOnly: true, 
      expires: new Date(Date.now()+ 8+360000)  ,  // can’t be accessed by JS (for security)
      secure: false,      // change to true if using https
      sameSite: "lax",    // allows cookie to be used in Postman/local requests
      path: "/",          // cookie applies to all routes
    });

    // ✅ Response after cookie is set
    res.status(200).send("Login Successful ✅");

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error: " + err.message);
  }
});


module.exports = authRouter;

