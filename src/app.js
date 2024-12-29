const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getData", (req, res) =>{ 
    res.send("Data send");
})
app.get("/admin/getAllCourses", (req , res) =>{
    res.send("Courses data send")
})

app.get("/user/data", userAuth, (req , res) =>{
    res.send("User data send") 
})
app.put("/user/login" , (req , res) =>{
    res.send("User logged in")
})
app.listen(3000, ()=>{
    console.log("App is listning at port no 3000");
})