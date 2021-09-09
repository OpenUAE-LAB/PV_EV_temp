const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const addDVA = async(vehicleID, driverID) =>{

    const newDVassignment = new DriverVehicleAssignment({
        vehicleID : vehicleID,
        driverID  : driverID,
        updateDate: Date.now()
    });

    return await newDVassignment.save(); 
    }

module.exports = addDVA;




