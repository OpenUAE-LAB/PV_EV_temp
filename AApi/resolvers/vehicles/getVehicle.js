const db = require("../../models");
const Vehicle= db.vehicle;


const getVehicle = async(vehicleID) =>{
    const vehicle = await Vehicle.find({_id:vehicleID, objectDeletionStatus: false});
    return vehicle[0];
}

module.exports = getVehicle;