const express = require("express");
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
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Object.keys(req.body).length === 0
    ) {
      return res
        .status(400)
        .send("Invalid request body: expected non-empty JSON");
    }

    validateEditProfileData(req);

    const loggedInUser = req.user;
    console.log("Logged in user before update:", loggedInUser);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, Your Profile is Updated Succesfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});
module.exports = profileRouter;
