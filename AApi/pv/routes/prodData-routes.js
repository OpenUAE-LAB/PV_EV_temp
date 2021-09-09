/**
 * SUMMARY: 
 * Endpoints for the produced Data
 * csession ==> for functions related to produced Data
 */

//import section
const { authJwt } = require("../services/verifications");
const controller = require("../controllers/productionData-controller");
const config = require("../.config/api-config");


module.exports = function(api) {
    //
    api.get(config.BASE_URL + "/prodData", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.viewProductionData);
    api.get(config.BASE_URL + "/prodData/day/:id?", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.viewProductionDataDay);
    api.get(config.BASE_URL + "/prodData/verfiy/day/:id", 
     controller.viewProductionDataDayWithVerification);
    api.delete(config.BASE_URL + "/prodData/:id", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.deleteProductionData);
};