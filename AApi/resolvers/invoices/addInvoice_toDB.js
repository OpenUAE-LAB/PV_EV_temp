const db = require("../../models");
const Invoice = db.invoice;

const addInvoice_toDB = async (chainEvent) =>{
    invoiceChain =JSON.parse(chainEvent.payload.toString());

    let invoiceObj = new Invoice({
        "_id":invoiceChain['assetID'] , 
        vehicleID: invoiceChain['vehicleID'],
        payerID  : invoiceChain['payerID'],
        payee    : invoiceChain['payee'],
        chargingSessionID: invoiceChain['chargingSessionID'],
        issueDate: invoiceChain['issueDate'],
        wattUnits: invoiceChain['wattUnits'],
        priceTotal:invoiceChain['priceTotal'],
        isPaid    : invoiceChain['isPaid'],
        objectDeletionStatus: false,
        objectHistory: [{date:invoiceChain['issueDate'], event:"Created"}]  
    });

    invoiceObj.isNew = true;
    invoiceObj.save((err, invoiceObj) => {
        if (err) {
            console.log('Error happened!')
            console.log({ message: err });
            return;
        } else {
            console.log({ message: "An invoice has been saved in DB successfully!", data: invoiceObj });
        }
    });
}


module.exports = addInvoice_toDB;