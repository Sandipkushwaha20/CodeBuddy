const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const app = express();


connectDB().then(() =>{
    console.log("DB connected successfully.");
    app.listen(3000,() =>{
        console.log("App is listening at Port no. 3000");
    })
}).catch(() =>{
    console.log("DB is not connected.")
})
