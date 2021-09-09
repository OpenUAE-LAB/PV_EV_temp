const { authJwt } = require("../services/verifications");
const controller = require("../controllers/logs-controllers.js");
const config = require("../.config/api-config");


module.exports = function(api) {
    api.get(config.BASE_URL + "/logs", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.veiwLogs);
}