const validator = require("validator");
const User = require("../models/user");

 


function validateSignUpData(req) {
  if (!req.body || typeof req.body !== "object") {
    throw new Error("Invalid request body");
  }

  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First Name and Last Name are required");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
}

function validateEditProfileData(req) {
  if (!req.body || typeof req.body !== "object") {
    throw new Error("Invalid request body");
  }

  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "gender",
    "age",
    "about",
    "skills",
    "photoUrl",
    "phone",
   
  ];

  const incoming = Object.keys(req.body); // <<-- correct: capital O
  if (incoming.length === 0) {
    throw new Error("Invalid Edit details: body is empty");
  }

  const isEditAllowed = incoming.every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    const forbidden = incoming.filter((f) => !allowedEditFields.includes(f));
    throw new Error("Invalid Edit details: forbidden fields - " + forbidden.join(", "));
  }

  if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
    throw new Error("Invalid Edit details: email is not valid");
  }

  if (req.body.age && !Number.isInteger(Number(req.body.age))) {
    throw new Error("Invalid Edit details: age must be an integer");
  }
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
