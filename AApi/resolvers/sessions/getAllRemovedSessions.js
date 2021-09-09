const db = require("../../models");
const chargingSession = db.chargingSession;


const getAllRemovedSessions = async() =>{
    const objects = await chargingSession.find({objectDeletionStatus: true});
    return objects;
}

module.exports = getAllRemovedSessions;