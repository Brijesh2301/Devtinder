// server.js
const express = require("express");
const connectDB = require("./config/database"); // Ensure the database is connected
const app = express();
const User = require("./models/user"); // Import the User model
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // Create a new user instance
  const user = new User(req.body);

  try {
    await user.save();
    res.send("Use added successfully");
  } catch (err) {
    console.log("Error while adding user", err);
    res.status(500).send("Internal Server Error");
  }
});
//GET User By Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if(!users){
      return res.status(404).send("User not found");
    } 
    res.send(users);
    // const users = await User.find({ emailId: userEmail });
    // if(users.length === 0){
    //   return res.status(404).send("User not found");
    // }
    // res.send(users);

  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//Feed Api - GET / Feed  -get all the useres from the database

app.get("/feed", async(req, res) => {
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

    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        new: true, // simpler alternative to returnDocument: "after"
        runValidators: true,
      }
    );

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
