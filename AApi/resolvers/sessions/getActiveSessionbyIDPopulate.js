const db = require("../../models");
const chargingSession = db.chargingSession;

const getActiveSessionbyIDPopulate = async(cSessionID) => { 
    return await chargingSession.find({ "_id": cSessionID , active: true})
    .populate(
        {path:'driverID',
        populate: { path: 'roles' }
    })
    .then(documents => { return documents})
}

module.exports = getActiveSessionbyIDPopulate;