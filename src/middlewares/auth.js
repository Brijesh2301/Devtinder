const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
     throw new Error("Token is not valid");
    }

    // Verify the token
    const decodedObj = await jwt.verify(token, "mySecretKey");
    const { userId } = decodedObj;

    // Find the user in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach user to request object for next middleware/route
    req.user = user;

    next(); // ✅ Proceed to next middleware
  } catch (error) {
    res.status(401).send("ERROR: " + error.message);
  }
};

module.exports = { userAuth };
