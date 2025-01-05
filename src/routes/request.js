const express = require("express");
const connectionRoute = express.Router();
const userAuth = require("../middlewares/auth")


connectionRoute.post("/sendConnectionReq", userAuth, async(req , res) =>{
    try{
        const user = req.user;
        return res.status(200).send(user.firstName + " send connection request successfully.");
    }catch(err){
        return res.status(500).send("Unable to send connection request. Please try again!");
    }
})


module.exports = connectionRoute; 