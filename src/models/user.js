const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    emailId: {
        type: String,
    },
    gender: {
        tpye: String,
    },
    age: {
        type: Number,
    }
});

module.exports = mongoose.model("User", userSchema);