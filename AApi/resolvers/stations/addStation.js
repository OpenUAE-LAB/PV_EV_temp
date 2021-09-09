const db = require("../../models");
const station = db.station;


const addStation = async(stationName, location, batteryCapacity, numPVCells, capacityPVCells) =>{

    const newstation= new station ({
        stationName    :  stationName,
        location :location,
        batteryCapacity:  batteryCapacity,
        numPVCells     :  numPVCells,
        capacityPVCells:  capacityPVCells,
    });
    
    return await newstation.save(); 

}

module.exports = addStation;






