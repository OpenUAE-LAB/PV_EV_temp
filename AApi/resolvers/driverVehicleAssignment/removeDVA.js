const db = require("../../models");
const DriverVehicleAssignment=  db.driverVehicleAssignment;



const removeDVA = async(objectID) =>{

   return await DriverVehicleAssignment.findByIdAndDelete(objectID);
}


module.exports = removeDVA;


