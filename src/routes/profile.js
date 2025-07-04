const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");

profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("Profile not found");
    }
})

module.exports = profileRouter;