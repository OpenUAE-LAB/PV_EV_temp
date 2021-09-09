const db = require("../../models");
const Vehicle= db.vehicle;


const getAllVehicles = async() =>{
    const vehicles = await Vehicle.find({objectDeletionStatus: false});
    return vehicles;
}

module.exports = getAllVehicles;