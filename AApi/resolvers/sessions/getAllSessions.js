const db = require("../../models");
const chargingSession = db.chargingSession;


const getAllSessions = async() =>{
    const objects = await chargingSession.find({objectDeletionStatus: false});
    return objects;
}

module.exports = getAllSessions;