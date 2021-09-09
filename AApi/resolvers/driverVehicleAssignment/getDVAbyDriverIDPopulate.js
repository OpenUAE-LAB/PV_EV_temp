const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getDVAbyDriverIDPopulate = async(driverID) =>{
        return await DriverVehicleAssignment.find({driverID:driverID})
        .populate('vehicleID driverID')
        .then(documents => {return documents})
    }

module.exports = getDVAbyDriverIDPopulate;
