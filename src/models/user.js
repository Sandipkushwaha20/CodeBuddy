const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLenght: 50,
    },
    lastName: {
        type: String,
        trim: true,
        maxLenght: 50,
    },
    password: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        lowercase: true, 
        unique: true,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid. It could only be 'male' OR 'female' OR'other'");
            }
        }
    },
    age: {
        type: Number,
        min:10,
        max:100
    },
    about: {
        type: String,
        default: "This is the default syntax of about.",
        minLength: 2,
        maxLenght:500,
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IYhSn8Y9S9_HF3tVaYOepJBcrYcd809pBA&s",
    },
    skills: {
        type: [String], 
    }
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);