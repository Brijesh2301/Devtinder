const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

//Get allthe pending requests for the loggedIn user

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
         const loggedInUser = req.user;
         const connectionRequests = await ConnectionRequest.find({
              toUserId: loggedInUser._id,   
                status: "interested"
         }).populate("fromUserId", "firstName lastNam"); // populate fromUserId with user details


            res.json({
                message: "Connection Requests fetched successfully",
                data: connectionRequests,
            })

  }
  
  
  catch (err) {
     return res.statusCode(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
