const express= require("express");
const app= express();
require('dotenv').config();
const dbConnect= require ('./database/database');
dbConnect();
const PORT = process.env.PORT||80;
app.get('/',(req,res)=>{
    res.send("hello the server is working");
});
app.listen(PORT,()=>{
console.log(`listening on PORT${PORT}`);
});