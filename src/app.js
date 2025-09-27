//creating the server

const express = require('express');

const app = express();

app.use('/test', (req, res) => {
    res.send("Hello from th");
});

app.use('/hello', (req,res)=>{
    res.send("Hello from ther dashboard ")
})


app.listen(3000, ()=>{
    console.log('Server is Running on port 3000')
});
