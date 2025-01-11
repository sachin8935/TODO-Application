const mongoose= require('mongoose');
require('dotenv').config();
const URL = process.env.URI;
const connection =mongoose.connect(URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("MongoDB connection is successful");
})
.catch((err)=>{
    console.log("The error is",err);
})
module.exports=connection;