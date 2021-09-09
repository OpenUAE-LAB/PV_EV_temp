const { truncate } = require("fs");
const db = require("../../models");
const Vehicle= db.vehicle;


const deactivateVehicle = async(vehicleID) =>{
    let db_response = await Vehicle.updateOne(
        {"_id":vehicleID, objectDeletionStatus: false, active : true},
        {
            active : false,
            $push: { objectHistory: {date: Date.now(), event:"Deactivated"}}

        });

        if (db_response.nModified){
            return true;
        }else{
            return false;
        }
        
    }

module.exports = deactivateVehicle;