const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getDVAbyVehicleIDPopulate = async(vehicleID) =>{
        return await DriverVehicleAssignment.find({vehicleID:vehicleID})
        .populate('vehicleID driverID')
        .then(documents => {return documents})
    }

module.exports = getDVAbyVehicleIDPopulate;