const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const isValidStatus = ["ignored", "interested", "accepted", "rejected"].includes(status);
        if(!isValidStatus){
            return res.status(400).send("Invalid status provided: " + status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send("User not found");
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(existingRequest){
            return res.status(400).send("Connection request already exists between " + req.user.firstName + " and " + toUser.firstName);
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        await connectionRequest.save();
        res.status(200).send(req.user.firstName + " is " + status + " in " + toUser.firstName);
    } catch (error) {
        console.log("Error in sending connection request:", error);
        res.status(400).send("Failed to send connection request: " + error.message);
    }
})

module.exports = requestRouter;
