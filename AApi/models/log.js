const mongoose = require("mongoose");

const Log = mongoose.model(
    "Log",
    new mongoose.Schema({
        timesamp  : Date,
        message : String,
    })
);

module.exports = Log;
