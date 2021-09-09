const { authJwt } = require("../services/verifications");
const controller = require("../controllers/invoice-controller");
const config = require("../.config/api-config");


module.exports = function(api) {
    api.get(config.BASE_URL + "/invoice", 
    //[authJwt.verifyToken, authJwt.isEvAdmin], 
    controller.viewInvoice);
    api.get(config.BASE_URL + "/invoice/verifyInvoice/:id", 
    //[authJwt.verifyToken, authJwt.isEvAdmin], 
    controller.verifyInvoice);   
    //functions for drivers only 
    api.get(config.BASE_URL + "/invoice/myInvoices", 
    [authJwt.verifyToken],
    controller.veiwMyInvoices);  
    api.get(config.BASE_URL + "/invoice/invoiceHTML/:id",controller.getInvoiceHTML);
    api.get(config.BASE_URL + "/invoice/invoiceHTMLBySession/:id",controller.getInvoiceHTMLBySessionID);
};

