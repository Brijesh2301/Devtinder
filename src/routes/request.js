const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const { run: sendEmail } = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value: " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (status === "interested") {
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });

        if (existingConnectionRequest) {
          return res.status(400).json({
            message: "Connection request already exists",
          });
        }
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // ✅ Email wrapped in try/catch — won't crash if AWS fails
      if (status === "interested") {
        try {
          const sendEmailRes = await sendEmail( "A new Friend Request from " + req.user.firstName, + " is " + status + " in " + toUser.firstName,);
          console.log("Email sent:", sendEmailRes);
        } catch (err) {
          console.log("Email skipped:", err.message);
        }
      }

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      console.error("Connection request error:", err);
      res.status(500).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "status is not allowed",
        });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "pending connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status + " successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;