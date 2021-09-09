const { authJwt } = require("../services/verifications");
const controller = require("../controllers/invoice-controller");
const config = require("../.config/api-config");


module.exports = function(api) {
    api.get(config.BASE_URL + "/invoice", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.viewInvoices);
    api.get(config.BASE_URL + "/invoice/viewRemoved", 
    //[authJwt.verifyToken, authJwt.isPvAdmin], 
    controller.viewRemovedInvoices);
    api.get(config.BASE_URL + "/invoice/verifyInvoice/:id", 
    //[ authJwt.isAuthorizedServerORisPvAdmin],
    controller.verifyInvoice);  
    api.put(config.BASE_URL + "/invoice/modifyInvoice/:id", 
    //[ authJwt.isAuthorizedServerORisPvAdmin],
    controller.modifyInvoice);     
    api.put(config.BASE_URL + "/invoice/removeInvoice/:id", 
    //[ authJwt.isAuthorizedServerORisPvAdmin],
    controller.removeInvoice);  
        
};

