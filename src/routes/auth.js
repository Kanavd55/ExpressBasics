const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const { generateJWT } = require("../utils/jwt-generator.js")
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
      return res.status(200).send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

authRouter.post("/logout",async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.status(200).send("User logged out successfully");
})

module.exports = authRouter;