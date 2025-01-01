const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

//! Middleware for parsing data from JSON formate
app.use(express.json()); 

app.post("/signup", async(req , res)=>{
    //Creating a new instance of the User Model
    const user = new User(req.body)
    // console.log("User data: ",user);  
    try{
        const existingEmail = await User.find({emailId: user.emailId});
        // console.log(existingEmail);
        if(existingEmail.length > 0){
            res.status(409).send(`You are already registered with this ${user.emailId}. Please try to login!`);
        }else{
            await user.save(); 
            // return res.send({user});
            res.send(201,user);
            // res.send("hii");
        }
    }catch(err){
        console.log(err);
        res.status(500).send("User not added." + err);
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
