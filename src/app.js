// server.js
const express = require("express");
const app = express();


const PORT = 3000;

app.use("/", (err, req,res, next)=>{
   if(err){
    res.status(500).send("Something went wrong" + err.message);
   }
})



// admin deleteUser route
app.get("/getUserData" , (req,res)=>{
  // logic of DB call and  get user data
  throw new Error("kdljgfnlksdf");
  res.send("User data is here");
}
);

app.use("/",(err,req,res,next)=>{
  if(err){
     res.status(500).send("Something went wrong");
  }

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
