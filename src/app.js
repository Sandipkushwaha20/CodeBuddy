const express = require("express");
const cors = require("cors")
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRoute = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
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











