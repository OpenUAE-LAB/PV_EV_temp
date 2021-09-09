const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getDVAbyVehicleID = async(vehicleID) =>{
        return await DriverVehicleAssignment.find({vehicleID:vehicleID})
        .then(documents => {return documents})
    }

module.exports = getDVAbyVehicleID;