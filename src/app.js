const express = require("express");
const connectDB = require("./config/database");
const app = express();
var cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
require('dotenv').config()

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter);
app.use("/",userRouter);
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is listening successfully on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
