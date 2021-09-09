const db = require("../../models");
const Invoice = db.invoice;


const getAllInvoicesByDriverID = async(driverID) =>{
    const objects = await Invoice.find(
        {objectDeletionStatus: false, payerID:driverID})
        .populate('vehicleID payerID')


    return objects;
}

module.exports = getAllInvoicesByDriverID;