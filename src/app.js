// server.js
const express = require("express");
const app = express();


const PORT = 3000;

const {adminAuth, userAuth } = require("./middlewares/auth");

//Handle Auth Middlware for all GET POST ... requests

app.use('/admin',adminAuth)

app.post("/user/login", (req, res)=>{
    res.send("User Log Sucessfully ")
})

app.post("/user/login", (req, res)=>{
    res.send("User Log Sucessfully ")
})

app.get("/user", userAuth, (req,res)=>{
    res.send("User Data sent")
})
// user route
app.get("/user", (req, res)=>{
  res.send("User Data sent");  
});

// admin getAllData route
app.get("/admin/getAllData", (req, res)=>{
   
        res.send("All data sent");
    }
   
);

// admin deleteUser route
app.get("/admin/deleteUser" , (req,res)=>{
  
        res.send("Delete a user");
    }
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
