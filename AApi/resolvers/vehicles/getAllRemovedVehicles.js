const db = require("../../models");
const Vehicle= db.vehicle;


const getAllRemovedVehicles = async() =>{
    const vehicles = await Vehicle.find({objectDeletionStatus: true});
    return vehicles;
}

module.exports = getAllRemovedVehicles;