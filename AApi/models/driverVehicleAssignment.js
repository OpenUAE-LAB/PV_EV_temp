const mongoose = require("mongoose");

const DriverVehicleAssignment = mongoose.model(
    "DriverVehicleAssignment",
    new mongoose.Schema({
        vehicleID  : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        },
        driverID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        updateDate:  Date
    })
);

module.exports = DriverVehicleAssignment;


