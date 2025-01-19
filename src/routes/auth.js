const express = require("express");
const authRouter = express.Router();
const {validateSignUpData , validateloginData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
//SignUp API
authRouter.post("/signup", async(req , res)=>{
    try{
        validateSignUpData(req);
        const {firstName,lastName,password,emailId,gender,skills,photoUrl,age} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        
        //Creating new instance of the User model
        const user = new User({
            firstName,
            lastName,
            password: hashedPassword,
            emailId,
            gender,
            skills,
            photoUrl,
            age
        })
        //check if user is alredy exist
        const existingEmail = await User.findOne({emailId: emailId}); 
        if(existingEmail){
            throw new Error(`You are already registered with this ${emailId}. Please try to login!`);
        }
        await user.save(); 
        return res.status(201).json({
            success: true,
            message: "You are loggedIn successfully."
        });
    }catch(err){
        console.log("ERROR:  ",err);
        return res.status(500).json({
            success: false,
            message: "User not added." + err
        });
    }
})

//Login API
authRouter.post("/login", async(req , res)=>{
    try{
        validateloginData(req);
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId}); // findOne() will always return an object while find() will always return an array
        
        if(!user){
            return res.status(401).send("You are not registered with this email. Please try to create a account.")
        }
        
        //Validate Password
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Your password is incorrect. Please try again..."
            });
        }

        //Create a JWT Token
        const token = await user.getJWT();
        // console.log("Token", token);
        //Add the token to cookie and send res back to the user
        res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000), httpOnly: true}); //Expire in 7 days
        
        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            data: user
        })
    }catch(err){
        return res.status(500).json({
            success: true,
            message: "Unable to login " + err
        })
    }
})

//Logout API
authRouter.post("/logout", async(req , res) =>{
    try{
        // res.clearCookie("token", {httpOnly: true, secure: true}); //send empty token or you can send token with 0 expiratin time
       res.cookie("token", null, {expires: new Date(Date.now())});
        return res.status(200).json({
            success: true,
            message: "logout successfully"
        });
    }catch(err){
        return res.status(500).josn({
            success: false,
            message: "Error: " + "while logout..." + err
        })
    }
})

module.exports = authRouter;