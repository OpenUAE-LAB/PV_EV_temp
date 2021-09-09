const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const getDVAbyDriverID = async(driverID) =>{
        return await DriverVehicleAssignment.find({driverID:driverID})
        .then(documents => {return documents})
    }

module.exports = getDVAbyDriverID;