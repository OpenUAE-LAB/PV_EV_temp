const db = require("../../models");
const chargingSession = db.chargingSession;


const getAllSessionsByDriverID = async(driverID) =>{
    const objects = await chargingSession.find(
        {objectDeletionStatus: false, driverID:driverID})
        .populate(
            {path:'driverID',
            populate: { path: 'roles' }
        })
    return objects;
}

module.exports = getAllSessionsByDriverID;