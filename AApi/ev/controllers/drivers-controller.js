const logging = require("../../resolvers/logging.js");

var ObjectId = require('mongoose').Types.ObjectId;
const driverService = require("./../../resolvers/driver");
const { check, validationResult } = require("express-validator");


const VIEW_DRIVER= {

    veiwDrivers: async (req,res) =>{
        let driverObjs =  await driverService.getAllDrivers();
        console.log("[veiwDrivers] ", driverObjs);

        if (driverObjs[0] == false){
            res.status(500).send({ message:driverObjs[1]});
        }else{
            res.status(200).send({ data: driverObjs[1] });
        }
    },
    cancelDriver: async (req,res) =>{
        const userID  = req.params.id;
        if (ObjectId.isValid(userID)){
            let db_response = await driverService.cancelDriver(userID);
            if (db_response){
                res.status(200).send({ message: "A driver has been cancelled successfully!" });
                logging.addLog("EV - VIEW_DRIVER", "cancelDriver", 24, `A driver has been cancelled successfully! ID ${userID}`);
            }else{
                res.status(400).send({ message: 'No object got modified' });

            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    }
}
module.exports = VIEW_DRIVER;