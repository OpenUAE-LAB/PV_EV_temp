const logging = require("../../resolvers/logging.js");

var ObjectId = require('mongoose').Types.ObjectId;
const VehicleService = require("./../../resolvers/vehicles");
const { check, validationResult } = require("express-validator");


const VIEW_Vehicle = {

    veiwVehicle: async(req,res) => {
        try{
            vehicles = await VehicleService.getAllVehiclesPopulate();
            res.status(200).json({data:vehicles});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    veiwRemovedVehicle: async(req,res) => {
        try{
            vehicles = await VehicleService.getAllRemovedVehicles();
            res.status(200).json({data:vehicles});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    addVehicle: async(req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
          return res.status(400).json({ errors: errors.array() });
        }   
        try{
            const newVehcile = await VehicleService.addVehicle(
                req.body.vehicleNumber,
                req.body.batteryCapacity,     
            );

            
            res.status(200).send({ message: "A new vehicle has been saved in DB successfully!" , data:newVehcile});
            logging.addLog("EV - VIEW_Vehicle", "addVehicle", 40, `New vehicle has been saved in DB. ${newVehcile}`);
        }catch(err){
            res.status(500).send({ message: err });
        }       
    },
    activateVehicle: async(req,res) =>{
        const vehicleID= req.params.id;
        if (ObjectId.isValid(vehicleID)){
            try{
                if(await VehicleService.activateVehicle(vehicleID)){
                    res.status(200).send({ message: "A vehicle has been activated successfully!" });
                    logging.addLog("EV - VIEW_Vehicle", "activateVehicle", 51, `A vehicle has been activated. ID: ${vehicleID}`);
                }else{
                    res.status(400).send({ message: 'No object got modified' });
                } 
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    deactivateVehicle: async(req,res) =>{
        const vehicleID= req.params.id;
        if (ObjectId.isValid(vehicleID)){  
            try{
                if(await VehicleService.deactivateVehicle(vehicleID)){
                    res.status(200).send({ message: "A vehicle has been deactivated successfully!" });
                    logging.addLog("EV - VIEW_Vehicle", "activateVehicle", 69, `A vehicle has been deactivated. ID: ${vehicleID}`);
                }else{
                    res.status(400).send({ message: 'No object got modified' });
                } 
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    cancelVehicle: async(req,res) =>{
        const vehicleID= req.params.id;
        if (ObjectId.isValid(vehicleID)){
            try{
                if(await VehicleService.removeVehicle(vehicleID)){
                    res.status(200).send({ message: "A vehicle has been cancelled successfully!" });
                    logging.addLog("EV - VIEW_Vehicle", "cancelVehicle", 87, `A vehicle has been cancelled. ID: ${vehicleID}`);
                }else{
                    res.status(400).send({ message: 'No object got modified' });
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
module.exports = VIEW_Vehicle;