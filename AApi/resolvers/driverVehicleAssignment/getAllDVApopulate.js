const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getAllDVApopulate = async() =>{
        return await DriverVehicleAssignment.find({})
        .populate('vehicleID driverID')
        .then(documents => {return documents})
    }

module.exports = getAllDVApopulate;