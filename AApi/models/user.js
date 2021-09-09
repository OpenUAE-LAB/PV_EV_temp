const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        firstname: String,
        lastname: String, 
        phoneNumber: String,
        email: String,
        password: String,
        active: Boolean,
        joiningDate: Date,
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
    })
);

module.exports = User;