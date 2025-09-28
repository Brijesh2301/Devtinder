//creating the server

const express = require('express');

const app = express();


app.get(/^\/ab+c$/, (req, res) => {
  res.send({ firstName: "Durgesh", lastName: "Kushwaha" });
});



//This will only handle GET call to /user
app.get('/user' ,(req,res) =>  {
    res.send({firstName: "Brijesh", lastName: "Kushwaha"})
});

//savig data into the database

app.post('/user', (req,res)=>{
    console.log("save data to the database ");
    res.send("Data sucessfully saved in the database ")
})

app.delete('/user', (req,res)=>{
  
    res.send("Delete the user ")
})






app.listen(3000, ()=>{
    console.log('Server is Running on port 3000')
});
