const express = require("express")
const app = express();

app.get("/radha",(req , res) =>{
     res.send("Radha get")
})
app.put("/radha",(req , res) =>{
     res.send("Radha put")
})
app.delete("/radha",(req , res) =>{
     res.send("Sandip delete call")
})
app.post("/radha",(req , res) =>{
     res.send("Radha Post call")
})
app.patch("/radha",(req , res) =>{
     res.send("Radha patch with krishna")
})
app.head("/radha",(req , res) =>{
     res.send("Radha head")
})
app.options("/radha",(req , res) =>{
     res.send("Radha options")
})

app.use("/",(req , res) =>{
     res.send("Krishna Krishna")
})
app.listen(3000, ()=>{
    console.log("App is listning at port no 3000");
})