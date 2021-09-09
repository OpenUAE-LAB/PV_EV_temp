/**
 * SUMMARY: 
 * Endpoints for the session 
 * csession ==> for functions related to csession
 */

//import section
const { authJwt } = require("../services/verifications");
const controller = require("../controllers/csession-controller");
const config = require("../.config/api-config");

module.exports = function(api) {
    //session
    api.get(config.BASE_URL + "/csession", 
     //   [authJwt.verifyToken, authJwt.isPvAdmin], 
        controller.veiwSessions);
    api.get(config.BASE_URL + "/csession/viewRemoved", 
    //   [authJwt.verifyToken, authJwt.isPvAdmin], 
        controller.veiwRemovedSessions);   
    api.get(config.BASE_URL + "/csession/sessionsByDriver", 
    //[authJwt.verifyToken, authJwt.isPvAdmin],
        controller.veiwSessionByDriver);
    api.post(config.BASE_URL + "/csession/initiateSession", 
    //[authJwt.isAuthorizedServer],
        controller.initiateSession);  
    api.put(config.BASE_URL + "/csession/endSession", 
    //[authJwt.isAuthorizedServer],
        controller.endSession);  
    api.put(config.BASE_URL + "/csession/modifySession/:id", 
    //[authJwt.isAuthorizedServer],
        controller.modifySession);  
    api.get(config.BASE_URL + "/csession/verifySession/:id", 
    //[ authJwt.isAuthorizedServerORisPvAdmin],
    controller.verifySession);  
    api.put(config.BASE_URL + "/csession/removeSession/:id", 
    //[ authJwt.isAuthorizedServerORisPvAdmin],
    controller.removeSession);  
        
};