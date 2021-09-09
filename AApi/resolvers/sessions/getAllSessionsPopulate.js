const db = require("../../models");
const chargingSession = db.chargingSession;


const getAllSessionsPopulate = async() =>{
    return await chargingSession.find({objectDeletionStatus: false})
    .populate('vehicleID driverID stationID')
    .then(documents => {return documents})
}

module.exports = getAllSessionsPopulate;