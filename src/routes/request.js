const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest",userAuth,   async (req, res) => {
  //sending connection request 
  console.log("sending a connection request")
  const user = req.user;
res.send(user.firstName +  "request sent successfully") 
});


module.exports = requestRouter;