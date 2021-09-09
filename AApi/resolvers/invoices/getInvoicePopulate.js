const db = require("../../models");
const Invoice = db.invoice;

const getInvoicePopulate = async(id) => { 
    return await Invoice.find({ "_id": id, objectDeletionStatus: false})
    .populate('vehicleID payerID')
    .then(documents => { return documents})
}


module.exports = getInvoicePopulate;