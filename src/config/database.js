const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://sandipkushwaha2437:udgxtQGDC8c37dc5@cluster0.1vnuddj.mongodb.net/CodeBuddy"
    );
};

module.exports = {connectDB};