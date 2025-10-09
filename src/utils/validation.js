const validator = require("validator");


const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");
    }
   else if(!emailId || !validator.isEmail(emailId)){
   
        throw new Error("Email is not valid");
    
   }
   else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter the strong Password");
   }
}

module.exports = {
    validateSignUpData
}