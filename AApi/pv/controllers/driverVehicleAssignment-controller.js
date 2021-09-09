var ObjectId = require('mongoose').Types.ObjectId;
const DVAService = require("./../../resolvers/driverVehicleAssignment");


const VIEW_DRIVER_VEHICLE_ASSIGNMENT= {

    viewDriverVehicleAssignment: async(req,res) =>{

        try{
            dvaObjs = await DVAService.getAllDVApopulate();
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
                res.status(200).json({data:dvaObjs});
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
