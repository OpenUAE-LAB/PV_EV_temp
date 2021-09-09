//import section
const { authJwt } = require("../services/verifications");
const controller = require("../controllers/station-controller");
const config = require("../.config/api-config");
const { check, validationResult } = require("express-validator");



module.exports = function(api) {
    //
    api.get(config.BASE_URL + "/station", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.viewStation);
    api.post(config.BASE_URL + "/station/addStation",
   // [authJwt.verifyToken, authJwt.isPvAdmin],  
    [
        check("stationName"    , "'stationName' is required!").not().isEmpty(),
        check("location"       , "'location' is required!").not().isEmpty(),
        check("batteryCapacity", "'batteryCapacity' is required!").not().isEmpty(),
        check("numPVCells"     , "'numPVCells' is required!").not().isEmpty(),
        check("capacityPVCells", "'capacityPVCells' is required!").not().isEmpty(),
    ],
    controller.addStation);
    api.put(config.BASE_URL + "/station/:id",
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
     controller.updateStation);
    api.delete(config.BASE_URL + "/station/:id", 
    //[authJwt.verifyToken, authJwt.isPvAdmin],
     controller.deleteStation);
};