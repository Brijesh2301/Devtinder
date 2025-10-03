const mongoose = require('mongoose');

const connectDB = async () => {
   await mongoose.connect("mongodb+srv://namstedev:brijesh@namstenodejs.uo03xgr.mongodb.net/",{dbName:"devTinderDB"});


   
};

module.exports = connectDB;


 

 


