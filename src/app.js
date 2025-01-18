const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRoute = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();

//! Middleware for parsing data from JSON formate
app.use(express.json()); 
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", connectionRoute);
app.use("/user", userRouter);

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
