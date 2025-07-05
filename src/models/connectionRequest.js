const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:[
                "ignored",
                "interested",
                "accepted",
                "rejected"
            ],
            message:`{VALUE} is not a valid status`
        }
    }
},{
    timestamps:true
})

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequestSchema.pre("save",function(next){
    const request = this;
    if(request.fromUserId.toString() === request.toUserId.toString()){
        throw new Error("Cannot send connection request to self");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);