//import section
const { authJwt } = require("../services/verifications");
const controller = require("../controllers/station-controller");
const config = require("../.config/api-config");


module.exports = function(api) {
    //
    api.get(config.BASE_URL + "/station", 
    //[authJwt.verifyToken], 
    controller.viewStation);
};