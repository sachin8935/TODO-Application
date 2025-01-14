const express= require("express");
const app= express();
const cookie_parser= require('cookie-parser');
const cors= require('cors');
app.use(cors());
app.use(cookie_parser());
app.use(express.json());
require('dotenv').config();
const PORT = process.env.PORT||80;
const dbConnect= require('./database/database');
dbConnect
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`listening on PORT ${PORT}`);
    });
    console.log("The mongoDB connection is established");
})
.catch((err)=>{
    console.log("There is issue with database connection");
})
const authRoute=require('./routes/path');
app.get('/',(req,res)=>{
    res.send('<h1>Hey we are here</h1>')
})
app.use('/',authRoute);