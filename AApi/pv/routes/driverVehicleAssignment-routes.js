const { authJwt } = require("../services/verifications");
const controller = require("../controllers/driverVehicleAssignment-controller");
const config = require("../.config/api-config");


module.exports = function(api) {

    api.get(config.BASE_URL + "/DVassignment", 
        //[authJwt.verifyToken, authJwt.isPvAdmin], 
        controller.viewDriverVehicleAssignment);
    api.get(config.BASE_URL + "/DVassignment/DVbyDriver", 
        //[authJwt.verifyToken, authJwt.isPvAdmin],
        controller.viewAllVehicleByDriver);
};