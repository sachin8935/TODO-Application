const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
const PORT = process.env.PORT || 80;
const dbConnect = require("./database/database");
dbConnect
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
    console.log("The MongoDB connection is established");
  })
  .catch((err) => {
    console.log("There is an issue with database connection");
  });

const authRoute = require("./routes/path");
app.use("/", authRoute);
app.get('/', function(req, res) {
    res.send('<h1>Hello I am here</h1>');
});
