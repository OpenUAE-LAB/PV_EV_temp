const db = require("../../models");
const chargingSession = db.chargingSession;

const getSession = async(cSessionID) => { 
    return await chargingSession.find(
        { "_id": cSessionID, objectDeletionStatus: false}
    ).then(documents => { return documents})
}


module.exports = getSession;