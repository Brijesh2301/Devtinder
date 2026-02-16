const express = require("express");

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    console.log("📥 Received body:", req.body); // ✅ ADD THIS
    
    // Validate the data
    validateSignUpData(req);
    console.log("✅ Validation passed"); // ✅ ADD THIS

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user already exists (login ki tarah)
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    console.log("👤 About to save user"); // ✅ ADD THIS
    const savedUser = await user.save();
    console.log("💾 User saved successfully"); // ✅ ADD THIS
    
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 3600000),
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.json({ 
      message: "User added successfully", 
      data: savedUser 
    });
    
  } catch (err) {
    console.error("❌ Signup error:", err); // Error details
    res.status(400).send("Error: " + err.message);
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
      emailId: emailId.toLowerCase().trim();

      return res.status(404).send("Email ID does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Password is not valid");
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, "mySecretKey", {
      expiresIn: "7d",
    });

    //  Send cookie in response
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 3600000), // can’t be accessed by JS (for security)
      secure: false, // change to true if using https
      sameSite: "lax", // allows cookie to be used in Postman/local requests
      path: "/", // cookie applies to all routes
    });

    // ✅Response after cookie is set
    res.send(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});

module.exports = authRouter;
