const db = require("../../models");
const chargingSession = db.chargingSession;

const getActiveSessionbyID = async(cSessionID) => { 
    return await chargingSession.find({ "_id": cSessionID, active: true}).then(documents => { return documents})
}

module.exports = getActiveSessionbyID;