const logging = require("../../resolvers/logging.js");


var ObjectId = require('mongoose').Types.ObjectId;
const DVAService = require("./../../resolvers/driverVehicleAssignment");
const VehicleService = require("./../../resolvers/vehicles");

const VIEW_DRIVER_VEHICLE_ASSIGNMENT= {

    viewDriverVehicleAssignment: async(req,res) =>{
        try{
            dvaObjs = await DVAService.getAllDVApopulate();
            res.status(200).json({data:dvaObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    viewMyVehicleAssignment: async(req,res) =>{ //function accessiable by drivers  
        try{
            dvaObjs = await DVAService.getDVAbyDriverIDPopulate(req.userId);
            res.status(200).json({data:dvaObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }        
    },
    viewAllVehicleByDriver: async(req,res) =>{
        let driverID = req.params.id;
        if (ObjectId.isValid(driverID)){
            try{
                dvaObjs = await DVAService.getDVAbyDriverIDPopulate(driverID);
                console.log("Requested ID", driverID, "obj", dvaObjs);
                res.status(200).json({data:dvaObjs});
            }catch(err){
                res.status(500).send({ message: err });
            }                 
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },   
    viewVehicleDrivingHistory: async(req,res) =>{
        let vehicleID = req.params.id;
        if (ObjectId.isValid(vehicleID)){
            try{
                dvaObjs = await  DVAService.getDVAbyVehicleIDPopulate(vehicleID);
                res.status(200).json({data:dvaObjs});
            }catch(err){
                res.status(500).send({ message: err });
            }                 
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },  
    addDriverVehicleAssignment: async(req,res) =>{
        let vehicleID = req.body.vehicleID;
        let driverID  = req.body.driverID ;
        await DVAService.addDVA(vehicleID, driverID);
        try{
            const dvaObjs = await DVAService.addDVA(vehicleID, driverID);
            await VehicleService.updateVehicleDriver(vehicleID, driverID);
            res.status(200).send({ message: "A new DVA has been saved in DB successfully!" , data:dvaObjs});
            logging.addLog("EV - VIEW_DRIVER_VEHICLE_ASSIGNMENT", "addDriverVehicleAssignment", 59, `New DVA has been saved in DB. ${dvaObjs}`);
        }catch(err){
            res.status(500).send({ message: err });
        }         
    },

    deleteDriverVehicleAssignment: async(req,res) =>{
        const assignmentID = req.params.id;
        if (ObjectId.isValid(assignmentID)){
            try{
                if(await DVAService.removeDVA(assignmentID)){
                    res.status(200).send({ message: "A Driver-Vehicle assignment has been deleted successfully!" });
                    logging.addLog("EV - VIEW_DRIVER_VEHICLE_ASSIGNMENT", "deleteDriverVehicleAssignment", 71, `A Driver-Vehicle assignment has been deleted successfully! ${assignmentID}`);
                    res.status(400).send({ message: "This Driver-Vehicle assignment ID was not found!" });
                }               
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }

    }        
}
module.exports = VIEW_DRIVER_VEHICLE_ASSIGNMENT;
