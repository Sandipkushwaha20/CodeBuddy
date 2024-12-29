const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.get("/admin/data", (req , res) =>{
    throw new Error("Error");
    res.send("data send")
});

app.use("/",(err , req , res , next) =>{
    if(err){
        res.status(500).send("Something wend wrong.")
    }
})

app.listen(3000, ()=>{
    console.log("App is listning at port no 3000");
})