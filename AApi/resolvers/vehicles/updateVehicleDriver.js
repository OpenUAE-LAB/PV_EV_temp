const db = require("../../models");
const Vehicle= db.vehicle;


const updateVehicleDriver = async(vehicleID,userID) =>{
    let db_response = await Vehicle.updateOne(
        {"_id":vehicleID, objectDeletionStatus: false}, 
        {
            lastActiveDriverID:userID,
            $push: { objectHistory: {date: Date.now(), event:`Assigned to ${userID}`} }
        }
    );

    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
}
module.exports = updateVehicleDriver;