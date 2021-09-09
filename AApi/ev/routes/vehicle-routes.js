const { authJwt } = require("../services/verifications");
const controller = require("../controllers/vehicle-controller.js");
const config = require("../.config/api-config.js");


const { check, validationResult } = require("express-validator");


module.exports = function(api) {
    //carts - Admin being able to view all carts
    api.get(config.BASE_URL + "/vehicle",
    //[authJwt.verifyToken, authJwt.isEvAdmin],
     controller.veiwVehicle);
    api.post(config.BASE_URL + "/vehicle/register",
    [
        check("vehicleNumber"  , "'vehicleNumber' is required!").not().isEmpty(),
        check("batteryCapacity", "'batteryCapacity' is required!").not().isEmpty(),
    ],
     //[authJwt.verifyToken],
        controller.addVehicle);
    api.put(config.BASE_URL + "/vehicle/activate/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin], 
        controller.activateVehicle);
    api.put(config.BASE_URL + "/vehicle/deactivate/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin], 
        controller.deactivateVehicle);
    api.put(config.BASE_URL + "/vehicle/remove/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin], 
        controller.cancelVehicle);

    api.get(config.BASE_URL + "/vehicle/listRemoved", 
        //[authJwt.verifyToken, authJwt.isEvAdmin], 
            controller.veiwRemovedVehicle);
    //normal driver being able to access his own cart

    
};