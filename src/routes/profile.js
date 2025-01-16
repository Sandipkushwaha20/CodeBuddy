const express = require("express");
const userAuth = require("../middlewares/auth")
const {validateEditProfileData,validateProfileChangePassword} = require("../utils/validation")
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.use("/", userAuth);

//Profile view API
profileRouter.get("/profile/view", async(req , res)=>{
    try{
        const user = req.user;
        return res.status(200).json({
            success: true,
            message: "Profile view.",
            data: user
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error during Profile view: " + err,
            data: user
        });
    }
    
})

//profile edit API
profileRouter.patch("/profile/edit", async(req , res) =>{
    try{
        validateEditProfileData(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) =>{loggedInUser[key] = req.body[key]});
        await loggedInUser.save();
        return res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName} your profile is edited successfully.`,
            data: loggedInUser
        }); 

    }catch(err){
        return res.status(500).send("Unable to edit user data. " + err);
    }

})

//password change API
profileRouter.patch("/profile/changePassword", async(req , res) =>{
    try{
        validateProfileChangePassword(req);
        const user = req.user;
        const existingHashedPassword = user.password;
        const {oldPassword, newPassword} = req.body;

        //validate oldPassword
        const isPasswordCorrect = await bcrypt.compare(oldPassword, existingHashedPassword);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success: false,
                message: "oldPassword is incorrect."
            })
        }

        //hash the new Password
        const newHashedPassword = await bcrypt.hash(newPassword,10);
        
        //save the hashed password 
        user.password = newHashedPassword;
        await user.save();

        //return the response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while updating password." + err
        })
    }
})

module.exports = profileRouter;