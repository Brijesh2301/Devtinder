const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,  
  },
  lastName: {  
    type: String,
    required: true,  
  },
  emailId: {   
    type: String,
    required: true,
    // unique: true,   // ✅ yaha unique rakhna sahi hai
  },
  password: {  
    type: String,
    required: true
  },
  address:{
    type: String,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
