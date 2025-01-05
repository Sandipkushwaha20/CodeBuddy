const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req , res , next) =>{
    try{
        //read the token
        const {token} = req.cookies;
        console.log("User Auth Working...");

        if(!token){
            return res.status(404).send("Error from userAuth Middleware:  Token is not present. Please try to login first.");
        }
        const decodedObj = jwt.verify(token , "secret");
        // console.log("Decc ",decodedObj);
        if(!decodedObj){
            return res.status(404).send("Token invalid.");
        }
        const userId = decodedObj._id;
        // console.log("ID: ", userId);

        const user = await User.findById({_id: userId});
        // console.log("USER: ", user);
        if(!user){
            return res.status(404).send("Error from userAuth Middleware:  User is not found. Please try again....");
        }

        req.user = user;
        // console.log("USER::: ", req.user);

        next();

    }catch(err){
        return res.status(500).send("ERROR from userAuth Middleware: " + err);
    }
}
module.exports = userAuth