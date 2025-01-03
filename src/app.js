const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const {validateSignUpData, validateloginData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

//! Middleware for parsing data from JSON formate
app.use(express.json()); 
app.use(cookieParser());
//SignUp API
app.post("/signup", async(req , res)=>{
    try{
        validateSignUpData(req);
        const {firstName,lastName,password,emailId,gender,skills,photoUrl} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        
        //Creating new instance of the User model
        const user = new User({
            firstName,
            lastName,
            password: hashedPassword,
            emailId,
            gender,
            skills,
            photoUrl
        })
        //check if user is alredy exist
        const existingEmail = await User.find({emailId: emailId}); 
        if(existingEmail.length > 0){
            throw new Error(`You are already registered with this ${emailId}. Please try to login!`);
        }
        await user.save(); 
        return res.send(user);
    }catch(err){
        console.log("ERROR:  ",err);
        return res.status(500).send("User not added." + err);
    }
})

//Login API
app.post("/login", async(req , res)=>{
    try{
        validateloginData(req);
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId}); // findOne() will always return an object while find() will always return an array
        // console.log("User data: ", user);
        if(!user){
            return res.status(401).send("You are not registered with this email. Please try to create a account.")
        }
        // console.log("Stored Password: ", user[0]?.password);
        const isPasswordValid = await bcrypt.compare(password, user?.password);
        // console.log("Pass: ",isPasswordValid);
        if(!isPasswordValid){
            return res.status(401).send("Please enter correct password.")
        }

        //Create a JWT Token
        const token = jwt.sign({
                _id: user._id
            },
            "secret",{expiresIn: 60}
        );
        // console.log(token);
        //Add the token to cookie and send res back to the user

        // const token = "sdklsssdsidseu399--r=ueee8ee8eeueididjdjdj";
        res.cookie("token", token);
        
        return res.status(200).send("User logged in successfully.")
    }catch(err){
        return res.status(500).send("Unable to login" + err);
    }
})

                                      
//Profile API
app.get("/profile", async(req , res)=>{
    try{
        const {userId} = req.body;
        const {token} = req.cookies;
        
        if(!userId){
            throw new Error("User id should be present.");
        }
        const user = await User.findById(userId);
        if(!user){ 
            throw new Error("User not found");
        }

        const decodedMessage = jwt.verify(token, "secret");
        if(!decodedMessage){
            throw new Error("Token invalid.");
        }
        user.password = undefined;
        return res.status(200).send({user});
    }catch(err){
        return res.status(500).send("Error: " + err);
    }
    
})

//Feed API - GET /feed - get all the data from the DB
app.get("/feed", async (req, res)=>{
    const {emailId} = req.body;
    // console.log(userEmail);
    
    try{
        // const user =  await User.findOne({emailId: `${userEmail}`}).sort({ createdAt: 1 });
        const user =  await User.findOne({emailId});
        
        console.log(user);
        if(user.length === 0){
            res.status(404).send(`User is not find with this ${emailId} id.`);
        }else res.status(200).send("User data");
    }catch(err){
        res.status(500).send("Unable to find user data");
        console.log("user not find");
    }
})
                                

//delete a user
app.delete("/user/delete", async (req , res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOneAndDelete(
            {emailId: userEmail}
        );
        console.log("Deleted Data of User ",user);
        res.send("User deleted successfully.");
    }catch(err){
        // console.err(err);
        res.status(500).send("Unable to delete user.");
        console.log("user conn't be deleted:  ", err);
    }
})

//findOneAndUpdate user
app.patch("/user/update", async (req , res)=>{
    const {emailId, newEmail} = req.body;
    console.log(emailId," === ", newEmail);
    try{
        const user = await User.findOneAndUpdate(
        {emailId, emailId},
        {emailId: `${newEmail}`}
    );
        console.log("Updated Data of User ",user);
        res.send(user);
    }catch(err){
        // console.err(err);
        res.status(500).send("Unable to updated user.");
        console.log("user conn't be updated:  ", err);
    }
}) 

//findByIdAndUpdate user
app.patch("/user/:id", async (req , res) =>{
    const userId = req.params?.id;
    console.log(userId);
    const data = req.body;
    // console.log(data,"  ,  ");

    try{
        const Allowed_Updates = ["firstName","lastName","age","gender","about","skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>{
            // console.log(k,", ");
            return Allowed_Updates.includes(k);
        });
        if(!isUpdateAllowed){
            throw new Error("Update is not allowed");
        }else{
            const user = await User.findByIdAndUpdate(userId , data, {
                returnDocument:'after',
                runValidators: true,
            });
            console.log(user);
            res.send(user);
        }
        
    }catch(err){
        console.log("User is unable to update by ID.")
        res.status(500).send("User is unable to update by Id." + err);
    }
})

//Most of the time mongoose functions return a promise so use async and await
connectDB().then(() =>{
    console.log("DB connected successfully.");
    app.listen(3000,() =>{
        console.log("App is listening at Port no. 3000");
    })
}).catch(() =>{
    console.log("DB is not connected.")
})  
