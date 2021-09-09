const db = require("../../models");
const Vehicle= db.vehicle;


const getAllVehiclesPopulate = async() =>{
    return await Vehicle.find({objectDeletionStatus: false})
    .populate('lastActiveDriverID')
    .then(vehicles => {return vehicles})
}

module.exports = getAllVehiclesPopulate;