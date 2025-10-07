const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      default: "Hey there! I am using DevTinder.",
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // ✅ yaha unique rakhna sahi hai
      spaces: false, // ✅ email me spaces nahi hone chahiye
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
      },
    },
  },
    { timestamps: true }
  
);

const User = mongoose.model("User", userSchema);

module.exports = User;
