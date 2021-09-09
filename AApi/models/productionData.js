const mongoose = require("mongoose");

const ProductionData = mongoose.model(
    "ProductionData",
    new mongoose.Schema({
        stationName  : String,
        weather : String,
        producedWattUnits: Number,
        batteryID: String,
        batteryLevel: Number,
        startTimeStamp: Date,
        endTimeStamp: Date,
        txHash:String
    })
);

module.exports = ProductionData;
