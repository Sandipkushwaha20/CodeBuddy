const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requred: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["interested","ignored","accepted","rejected"],
            message: `{VALUE} is incorrect status type.`
        }
    }

}, {timestamps: true})

connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
    const ConnectionRequest = this;
    //check if the fromUserId is same as toUserId
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("You cann't send request yourself.");
    }
    next();
})

const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;