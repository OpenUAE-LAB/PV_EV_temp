const db = require("../../models");
const Vehicle= db.vehicle;


const removeVehicle = async(vehicleID) =>{
    let db_response =  await Vehicle.updateOne(
        {"_id":vehicleID, objectDeletionStatus: false}, 
        {
            objectDeletionStatus: true,
            active : false,
            $push: { objectHistory: {date: Date.now(), event:"Deleted"} }
        }
    );


    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
    
}
module.exports = removeVehicle;