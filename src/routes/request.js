const express = require("express");
const connectionRoute = express.Router();
const userAuth = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

connectionRoute.post("/request/send/:status/:toUserId", userAuth, async(req , res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        //Handel corner Cases:

        //check is toUserId resistered with us
        const isToUserExist = await User.findById(toUserId);
        if(!isToUserExist){
            return res.status(404).json({ 
                success: false,
                message: "You are trying to send the request to an unknown user."
            })
        }

        //check status should be only ["interested", "ignored"]
        const allowedStatus = ["interested", "ingnored"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({
                success: false,
                message: status + " is invalid status"
            })
        }
        //check are you sending request yourself => this is done in connectionRequest model
        
        //check users are already connected with each other 
        const isAlredyConnected = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId: fromUserId}
            ]
        })
        // console.log("sksk : " ,isAlredyConnected);
        if(isAlredyConnected){
            return res.status(400).json({
                success: false,
                message: `You are alredy connected with ${isToUserExist.firstName}`
            })
        }

        const connectionRequestData = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status,
        })

        await connectionRequestData.save();
        const requestiUser = await User.findById(toUserId);
        return res.status(200).json({
            success: true,
            message: req.user.firstName + " send successfully connection request to " + requestiUser.firstName,
            data: connectionRequestData
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to send connection request. Please try again!" + err
        })
    }
})

connectionRoute.post("/request/review/:status/:requestId", userAuth, async(req , res) =>{
    try{
        //loggedIn user
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        //validate status
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                success: false,
                message: status + " is invalid status."
            })
        }

        //validate loggedIn user and toUser is same or not
        const connectionRequest = await ConnectionRequest.findOne(
            {_id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
            }
        )
        if(!connectionRequest){
            return res.status(404).json({
                successs: false,
                message: "Connection request not found."
            })
        }

        //accept the request and save in DB
        connectionRequest.status = "accepted";
        const data = await connectionRequest.save();
        return res.status(200).json({
            success: true,
            message: "Connection request accepted.",
            data: data
        })
    }catch(err){
        return res.status(500).json({
            successs: false,
            message: "Error during request-review: " + err
        })
    }
})


module.exports = connectionRoute; 