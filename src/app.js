const express = require("express");
const {userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const {validateSignUpData, validateloginData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
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
        
        if(!user){
            return res.status(401).send("You are not registered with this email. Please try to create a account.")
        }
        
        //Validate Password
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            return res.status(400).send("Your password is incorrect. Please try again...");
        }

        //Create a JWT Token
        const token = await user.getJWT();
        // console.log("Token", token);
        //Add the token to cookie and send res back to the user
        res.cookie("token", token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true}); //Expire in 7 days
        
        return res.status(200).send("User logged in successfully.")
    }catch(err){
        return res.status(500).send("Unable to login " + err);
    }
})
                           
//Profile API
app.get("/profile", userAuth, async(req , res)=>{
    try{
        const user = req.user;
        return res.status(200).send(user);
    }catch(err){
        return res.status(500).send("Error: " + err);
    }
    
})

app.post("/sendConnectionReq", userAuth, async(req , res) =>{
    try{
        const user = req.user;
        return res.status(200).send(user.firstName + " send connection request successfully.");
    }catch(err){
        return res.status(500).send("Unable to send connection request. Please try again!");
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













// //Feed API - GET /feed - get all the data from the DB
// app.get("/feed", userAuth, async (req, res)=>{
//     try{
//         // const user =  await User.findOne({emailId: `${userEmail}`}).sort({ createdAt: 1 });
//         const {emailId} = req.body;
//         const user =  await User.findOne({emailId});
        
//         console.log(user);
//         if(!user){
//             res.status(404).send(`User is not find with this ${emailId} id.`);
//         }else res.status(200).send("User data: " + user);
//     }catch(err){
//         res.status(500).send("Unable to find user data");
//         console.log("user not find");
//     }
// })
                                

// //delete a user
// app.delete("/user/delete", userAuth, async (req , res)=>{
//     try{
//         const user = await User.deleteOne(
//             req.user._id
//         );
//         console.log("Deleted Data of User ",user);
//         res.status(204).send("User deleted successfully.");
//     }catch(err){
//         // console.err(err);
//         res.status(500).send("Error from deleteAPI:  Unable to delete user." + err);
//         console.log("user conn't be deleted:  ", err);
//     }
// })

// //findByIdAndUpdate user
// app.patch("/user/UpdateById", userAuth, async (req , res) =>{
//     // console.log(data,"  ,  ");
    
//     try{
//         const userId = req.user?.id;
//         // console.log(userId);
//         const data = req.body;
//         const Allowed_Updates = ["firstName","lastName","age","gender","about","skills"];
//         const isUpdateAllowed = Object.keys(data).every((k) =>{
//             // console.log(k,", ");
//             return Allowed_Updates.includes(k);
//         });

//         if(!isUpdateAllowed){
//             throw new Error("Update is not allowed");
//         }else{
//             const user = await User.findByIdAndUpdate(userId , data, {
//                 returnDocument:'after',
//                 runValidators: true,
//             });
//             // console.log(user);
//             res.send(user);
//         }
        
//     }catch(err){
//         console.log("User is unable to update by ID.")
//         res.status(500).send("User is unable to update by Id." + err);
//     }
// })
