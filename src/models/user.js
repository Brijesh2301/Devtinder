const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("./connectionRequest");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 50,
      index: true,
       
    },
    lastName: {
      type: String,
      required: true,
    
    },
    age:{
 type: Number,  // Make sure this exists
   
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder.",
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"},
        
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
      resetPasswordToken: String,
      resetPasswordExpires: Date,
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
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender`,
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value.toLowerCase())) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
  },
  { timestamps: true }, // ✅ No syntax error now
);

// User.find({firstName: "John", lastName: "Doe"})

userSchema.index({firstName:1, lastName:1})
 

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "mySecretKey", {
    expiresIn: "7d",
  });  

  return token;
};

const User = mongoose.model("User", userSchema);
userSchema.method.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.passwordHash;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};
module.exports = User;
