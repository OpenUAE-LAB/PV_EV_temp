const db = require("../../models");
const chargingSession = db.chargingSession;

const getSessionPopulate = async(cSessionID) => { 
    return await chargingSession.find({ "_id": cSessionID, objectDeletionStatus: false})
    .populate('vehicleID driverID stationID')
    .then(documents => { return documents})
}


module.exports = getSessionPopulate;