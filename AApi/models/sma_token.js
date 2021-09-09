const mongoose = require("mongoose");

const SMAToken = mongoose.model(
    "SMAToken",
    new mongoose.Schema({
        refresh_token: String,
        obtainedData: Date, 
    })
);

module.exports = SMAToken;