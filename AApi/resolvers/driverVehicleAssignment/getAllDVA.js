const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getAllDVA = async() =>{
        return await DriverVehicleAssignment.find({})
        .then(documents => {return documents})
    }

module.exports = getAllDVA;