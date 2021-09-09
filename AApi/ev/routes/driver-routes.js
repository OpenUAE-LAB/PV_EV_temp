const { authJwt } = require("../services/verifications");
const controller = require("../controllers/drivers-controller.js");
const config = require("../.config/api-config");


module.exports = function(api) {
    api.get(config.BASE_URL + "/driver", 
    //[authJwt.verifyToken, authJwt.isEvAdmin],
    controller.veiwDrivers);
    api.put(config.BASE_URL + "/driver/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin],
    controller.cancelDriver);

};




