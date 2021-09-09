const mongoose = require("mongoose");

const ChargingSession = mongoose.model(
    "ChargingSession",

    new mongoose.Schema({
        vehicleID  : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        },
        driverID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        stationID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station"
        },
        chargedPower: Number,
        startDate:Date,
        endDate: Date,
        initalChargingPercentage: Number,
        endChargingPercentage: Number,
        active: Boolean, 
        objectDeletionStatus: Boolean,
        objectHistory: [{date:Date, event:String}]

    })
);

module.exports = ChargingSession;

