/**
 * SUMMARY: 
 * Endpoints for the session 
 * csession ==> for functions related to csession
 */

//import section
const { authJwt } = require("../services/verifications");
const controller = require("../controllers/csession-controller");
const config = require("../.config/api-config");

const { check, validationResult } = require("express-validator");


module.exports = function(api) {
    //session
    api.get(config.BASE_URL + "/csession", 
    //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.veiwSession);
    api.get(config.BASE_URL + "/csession/verifySession/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin],
    controller.verifySession);
    api.get(config.BASE_URL + "/csession/viewRemoved", 
    //   [authJwt.verifyToken, authJwt.isEvAdmin], 
        controller.veiwRemovedSessions);  
    api.post(config.BASE_URL + "/csession/start", 
    [
        check("vehicleID"  , "'vehicleID' is required!").not().isEmpty(),
        check("stationID", "'stationID' is required!").not().isEmpty(),
        check("initalChargingPercentage", "'initalChargingPercentage' is required!").not().isEmpty(),
    ],
    [authJwt.verifyToken],
        controller.startSession);
    api.put(config.BASE_URL + "/csession/:id",     [
        check("endChargingPercentage"  , "'endChargingPercentage' is required!").not().isEmpty(),
     ],
    //[authJwt.verifyToken],
        controller.endSession);

    api.put(config.BASE_URL + "/csession/deleteSession/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin],
        controller.deleteSession);

    api.get(config.BASE_URL + "/csession/sessionsByDriver", 
    [authJwt.verifyToken, authJwt.isEvAdmin],
        controller.veiwSessionByDriver);
    //functions for drivers only 
    api.get(config.BASE_URL + "/csession/mySessions", 
    [authJwt.verifyToken],
        controller.veiwMySessions);  
    /*api.get(config.BASE_URL + "/csession/mySessions/verify", 
    //[authJwt.verifyToken],
        controller.veiwMySessionsVerified); */
};