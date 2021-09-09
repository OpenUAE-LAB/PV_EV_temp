const db = require("../../models");
const chargingSession = db.chargingSession;


const updateActiveSessions_db = async (query, updateAmount) =>{


    return await chargingSession.updateMany(query, { $inc: { "chargedPower": updateAmount } }).lean();


}


module.exports = updateActiveSessions_db;

