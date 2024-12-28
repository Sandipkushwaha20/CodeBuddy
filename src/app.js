const express = require("express")
const app = express();

app.use("/ram",(req , res) =>{
    return res.send("Ram")
})
app.use("/radha",(req , res) =>{
    return res.send("Radha Radha Rdha")
})
app.use("/krishna",(req , res) =>{
    return res.send("Krishna")
})


app.listen(3000, ()=>{
    console.log("App is listning at port no 3000");
})