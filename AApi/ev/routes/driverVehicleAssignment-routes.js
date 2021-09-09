const { authJwt } = require("../services/verifications");
const controller = require("../controllers/driverVehicleAssignment-controller");
const config = require("../.config/api-config");

const { check, validationResult } = require("express-validator");




module.exports = function(api) {

    api.get(config.BASE_URL + "/DVassignment", 
        //[authJwt.verifyToken, authJwt.isEvAdmin], 
        controller.viewDriverVehicleAssignment);
    api.get(config.BASE_URL + "/DVassignment/DVbyDriver/:id", 
        //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.viewAllVehicleByDriver);
    api.get(config.BASE_URL + "/DVassignment/DVbyVehicle/:id", 
        //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.viewVehicleDrivingHistory);
    api.post(config.BASE_URL + "/DVassignment/newDV", 
        //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.addDriverVehicleAssignment);
    api.delete(config.BASE_URL + "/DVassignment/:id", 
        //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.deleteDriverVehicleAssignment);

    //Callable by driver
    api.get(config.BASE_URL + "/DVassignment/viewMyVehicles", 
        [authJwt.verifyToken],
        controller.viewMyVehicleAssignment);
    

};