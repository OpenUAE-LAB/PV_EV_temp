const db = require("../../models");
const chargingSession = db.chargingSession;


const getAllActiveSessions = async() =>{
    const objects = await chargingSession.find({active: true, objectDeletionStatus: false});
    return objects;
}

module.exports = getAllActiveSessions;