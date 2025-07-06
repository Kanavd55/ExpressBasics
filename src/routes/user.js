const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests",userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName", "lastName", "photoUrl"]);
        res.status(200).send({
            message: "User requests fetched successfully",
            connectionRequests
        })
    } catch (error) {
        console.log("Error in fetching user requests:", error);
        res.status(400).send("Failed to fetch user requests: " + error.message);
        
    }
})

userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])
          .populate("toUserId", ["firstName", "lastName", "photoUrl"]);
        const data = connections?.map(connection =>{
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()){
                return connection.toUserId
            }
            return connection.fromUserId;
        })
        if (data.length === 0) {
            return res.status(404).send("No connections found for the user");
        }
        res.status(200).send({
            message: "User connections fetched successfully",
            connections: data
        });
    } catch (error) {
        console.log("Error in fetching user connections:", error);
        res.status(400).send("Failed to fetch user connections: " + error.message);
        
    }
})

module.exports = userRouter;