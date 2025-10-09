// server.js
const express = require("express");
const connectDB = require("./config/database"); // Ensure the database is connected
const app = express();
const User = require("./models/user"); // Import the User model
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
//Signup Api - POST / signup
app.post("/signup", async (req, res) => {
  try {
    //validate of the data
    validateSignUpData(req);

    //Encrypt the password before saving it to the database
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("Use added successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//Login Api - POST / login

app.post("/login", async(req,res)=>{
  try{
    const {emailId, password} = req.body;
    
    const user = await User.findOne({emailId: emailId});

    if(!user){
      throw new Errro("EmailId is  not exists")
    }

    if(!emailId || !password){
      return res.status(400).send("Email and Password are required");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      res.send("Login Successful");
    }
    else{
      res.status(401).send("Password is not valid ");
    }
  }
  catch(err){   
    res.status(500).send("Error:"+ err.message );
  }
});

//GET User By Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      return res.status(404).send("User not found");
    }
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//Feed Api - GET / Feed  -get all the useres from the database

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    console.log("Delete error:", error);
    res.status(400).send("Something went wrong");
  }
});

//Update the data of user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "password"];

    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Update not allowed"); // ✅ added return
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true, // simpler alternative to returnDocument: "after"
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).send("Update failed: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });
