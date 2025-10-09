const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 50,
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
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid: " + value);
        }
      },
    }, // ✅ Properly closed emailId object

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough: " + value);
        }
      },
    }, // ✅ Now it’s a separate top-level field

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
  { timestamps: true } // ✅ No syntax error now
);

const User = mongoose.model("User", userSchema);
module.exports = User;
