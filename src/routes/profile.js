const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const bcrypt = require("bcrypt");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("Profile not found");
    }
});

profileRouter.patch("/profile/edit",userAuth, async (req,res) => {
    try {
        const isValid = validateEditProfileData(req);
        if(!isValid){
            res.status(400).send("Invalid Edit Request");
        }
        const user = req.user;
        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });
        await user.save();
        res.status(200).send("Profile updated successfully");
    } catch (error) {
        res.status(400).send("Profile update failed: " + error.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword,newPassword } = req.body;
        const user = req.user;

        const isPasswordMatch = await user.validatePassword(oldPassword);
        if (!isPasswordMatch) {
            return res.status(400).send("Old password is incorrect");
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send("Password changed successfully");
    } catch (error) {
        res.status(400).send("Password change failed: " + error.message);
    }
});

module.exports = profileRouter;