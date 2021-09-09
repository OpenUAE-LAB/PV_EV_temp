const db = require("../../models");
const Vehicle= db.vehicle;


const activateVehicle = async(vehicleID) =>{
    let db_response = await Vehicle.updateOne(
        {"_id":vehicleID, objectDeletionStatus: false, active :false},
        {
            active : true,
            $push: { objectHistory: {date: Date.now(), event:"Activated"} }
        });
        console.log(db_response.nModified)
        if (db_response.nModified!=0){
            return true;
        }else{
            return false;
        }
    }

module.exports = activateVehicle;