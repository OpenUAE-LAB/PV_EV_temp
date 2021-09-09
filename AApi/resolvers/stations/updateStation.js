const db = require("../../models");
const station = db.station;



const updateStation = async(stationID, stationName, location, batteryCapacity, numPVCells, capacityPVCells) =>{
    console.log('---------------updateStation-----------------');
    
    let db_response = await  station.updateOne({"_id":stationID}, {
        stationName :stationName,
        location :location,
        batteryCapacity : batteryCapacity,
        numPVCells:  numPVCells,
        capacityPVCells: capacityPVCells,
    });

    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
}
module.exports = updateStation;

