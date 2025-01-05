const express = require("express");
const userAuth = require("../middlewares/auth")
const profileRouter = express.Router();
//Profile API
profileRouter.get("/profile", userAuth, async(req , res)=>{
    try{
        const user = req.user;
        return res.status(200).send(user);
    }catch(err){
        return res.status(500).send("Error: " + err);
    }
    
})



module.exports = profileRouter;