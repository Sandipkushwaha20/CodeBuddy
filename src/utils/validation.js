const validator = require('validator');

const validateSignUpData = (req) =>{
    console.log("SignUp data validating...");
    const {firstName , lastName, password, emailId} = req.body;
    if(!firstName || !lastName ||!password || !emailId){
        throw new Error("All fields are mandatory");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password.");
    }
}

const validateloginData = (req) =>{
    console.log("Login data validating...");
    const {emailId, password} = req.body;
    if(!password || !emailId){
        throw new Error("All fields are mandatory");
    }
}

module.exports = {validateSignUpData , validateloginData};