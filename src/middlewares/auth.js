const adminAuth = (req , res , next) =>{
    console.log("Admin auth checked.")
    const token = "sksksk";
    if(token !== "sksksk"){
        res.send("Admin is unAuthorised");
    }else{
        next();
    }
}


const userAuth = (req , res , next) =>{
    console.log("User auth checked.")
    const token = "sksksk";
    if(token !== "sksksk"){
        res.send("User is unAuthorised");
    }else{
        next();
    }
}
module.exports = {adminAuth, userAuth}