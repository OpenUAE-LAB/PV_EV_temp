const db = require("../../models");
const chargingSession = db.chargingSession;

const getSessionFinished = async(cSessionID) => { 
    return await chargingSession.find({ "_id": cSessionID, active:false})
    .then(documents => { return documents})
}


module.exports = getSessionFinished;