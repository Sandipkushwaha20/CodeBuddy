const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

//! Middleware for parsing data from JSON formate
app.use(express.json());

app.post("/signup", async(req , res)=>{
    console.log(req.body);
    //Creating a new instance of the User Model
    const user = new User(req.body);
    console.log("User data ",user);
    
    try{
        await user.save();
        res.send("User added successfully.");
    }catch(err){
        console.log(err);
        res.send("User not added.",err);
    }
    res.send(user);
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
