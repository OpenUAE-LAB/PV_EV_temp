const mongoose = require("mongoose");

const Vehicle = mongoose.model(
    "Vehicle",
    new mongoose.Schema({
        vehicleNumber: Number,
        batteryCapacity: Number,
        active: Boolean,
        lastActiveDriverID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        objectDeletionStatus: Boolean,
        objectHistory: [{date:Date, event:String}]
    })
);

module.exports = Vehicle;


//$push: { objectHistory: {date: sessionChain['endDateTime'], event:"Modified - Session Ended"} }