const validator = require('validator');
const User = require('../models/user');

const validateSignUpData = (req) =>{
    // console.log("data validating...");
    const {firstName , lastName, password, emailId} = req.body;
    if(!firstName || !lastName ||!password || !emailId){
        throw new Error("All fields are mandatory");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password.");
    }
}

module.exports = validateSignUpData;