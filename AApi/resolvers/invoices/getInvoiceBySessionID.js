const db = require("../../models");
const Invoice = db.invoice;


const getInvoiceBySessionID = async(chargingSessionID) =>{
    const objects = await Invoice.find(
        {objectDeletionStatus: false, chargingSessionID:chargingSessionID})
        .populate('vehicleID payerID')


    return objects;
}

module.exports = getInvoiceBySessionID;