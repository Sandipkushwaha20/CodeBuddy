const express = require("express")
const app = express();


// app.use('/user', [rh , rh], rh, rh, rh, [rh, rh]) // you can write as many as route handler as you want
// also you can wrapp up then on a array
app.get("/radha",(req , res, next) =>{
    //  res.send("Radha get Radha")
    next()
     console.log("Radha 1")
     res.send("Ram Ram")
    
    //  next() 
},
// next(),
    (req,res) =>{
        console.log("Radha 2");
        res.send("Radha Radha")
    }
)


//! Dynamic route
app.get("/radha/:name",(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

//! Multiple dynamic route
app.get("/radha/:name/:password",(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

//! Different type of routing
//Here we can add as many 'b' in route like abc, abbbc etc, but abbbcc and aabbbbbbbbbbc (double 'c' or 'a') will be invalid route
app.get("/ab+c",(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

//Here we can add as many 'b' after 'b' and 'c' after 'c' in route like abc, abbbcc etc, but aabbbcc and  (double 'a') will be invalid route
app.get("/ab*c",(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

app.get("/a(bb)c",(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

// It will work for any route which will end with fly like butterfly, nnssnfly etc
app.get(/.*fly/,(req , res) =>{
    console.log(req.params);
    res.send("Radha get")
})

// app.put("/radha",(req , res) =>{
//      res.send("Radha put")
// })
// app.delete("/radha",(req , res) =>{
//      res.send("Sandip delete call")
// })
// app.post("/radha",(req , res) =>{
//      res.send("Radha Post call")
// })
// app.patch("/radha",(req , res) =>{
//      res.send("Radha patch with krishna")
// })
// app.head("/radha",(req , res) =>{
//      res.send("Radha head")
// })
// app.options("/radha",(req , res) =>{
//      res.send("Radha options")
// })

// app.use("/",(req , res) =>{
//      res.send("Krishna Krishna")
// })
app.listen(3000, ()=>{
    console.log("App is listning at port no 3000");
})