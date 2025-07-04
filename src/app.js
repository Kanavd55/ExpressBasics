const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const { userAuth } = require("./middlewares/userAuth");
const { validateSignupData } = require("./utils/validation");
var cookieParser = require("cookie-parser");
const { generateJWT } = require("./utils/jwt-generator.js")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const password = req.body.password;
    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    //Creating a new instance of User model
    const user = new User(req.body);
    //saving data to db
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    return res.status(400).send("Signup failed: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const password = req.body.password;
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      //generating jwt token
      const token = await generateJWT(user._id)
      res.cookie("token", token);
      return res.status(401).send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

app.get("/profile",userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("Profile not found");
    }
})


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
