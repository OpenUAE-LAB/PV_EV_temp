const db = require("../../models");
const Vehicle= db.vehicle;


const addVehicle = async(vehicleNumber,batteryCapacity) =>{
    const newVehicle = new Vehicle({
        vehicleNumber:      vehicleNumber,
        batteryCapacity:    batteryCapacity,
        active : true,
        objectDeletionStatus: false,
        objectHistory: [{date:Date.now(), event:"Created"}]

    });

    return await newVehicle.save(); 
}

module.exports = addVehicle;