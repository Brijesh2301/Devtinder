const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // ensure body exists and is non-empty
    if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
      return res.status(400).send("Invalid request body: expected non-empty JSON");
    }

    // validateEditProfileData throws if invalid — do NOT wrap in if()
    validateEditProfileData(req);

    const loggedInUser = req.user;
    console.log("Logged in user before update:", loggedInUser);
     

    // apply updates
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    if (typeof loggedInUser.save === "function") {
      await loggedInUser.save();
    } else {
      // fallback: if req.user is not a Mongoose doc, do DB update here
      // await User.findByIdAndUpdate(loggedInUser._id, req.body, { new: true });
    }

    console.log("Logged in user after update:", loggedInUser);
   res.send(`${loggedInUser.firstName} prfoile updated successfully`);
  } catch (err) {
    const status = err.message?.toLowerCase().includes("invalid") ? 400 : 500;
    return res.status(status).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
