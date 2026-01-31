const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status value: " + status 
      });
    }

    

    // ✅ FIX 1: Check if toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // ✅ FIX 2: Only check for existing request if status is "interested"
    // "ignored" should be allowed even if connection exists
    if (status === "interested") {
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ 
          message: "Connection request already exists" 
        });
      }
    }

    // ✅ FIX 3: Use the status variable, not hardcoded "interested"
    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status, // Changed from status: "interested"
    });

    const data = await connectionRequest.save();

    // ✅ FIX 4: Use toUser.firstName (from fetched user object)
    res.json({

      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    });

  } catch (err) {
    console.error("Connection request error:", err);
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = requestRouter;