const db = require("../../models");
const Vehicle= db.vehicle;


const getVehiclePopulate = async(vehicleID) =>{
    return await await Vehicle.find({_id:vehicleID, objectDeletionStatus: false})
    .populate('lastActiveDriverID')
    .then(vehicle => {return vehicle[0]})
}

module.exports = getVehiclePopulate;