const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async(req , res)=>{
    const user = new User({
        firstName: "Radhe Radhe",
        lastName: "Ram Ram",
        emailId: "radhe@gmail.com",
        password: "radhe@1233"
    });

    try{
        await user.save();
        res.send("User added successfully.");
    }catch(err){
        res.send("User not added.");
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
