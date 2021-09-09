const { authJwt } = require("../services/verifications");
const controller = require("../controllers/pricing-controller");
const config = require("../.config/api-config");


module.exports = function(api) {

    api.get(config.BASE_URL + "/pricing", 
    //     [authJwt.verifyToken, authJwt.isPvAdmin], 
        controller.viewPricing);

    api.put(config.BASE_URL + "/pricing/modify/:id", 
    //    [authJwt.verifyToken, authJwt.isPvAdmin], 
        controller.modifyPricing);
        
};