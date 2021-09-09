const db = require("../../models");
const Invoice = db.invoice;


const getAllInvoicesPopulate = async() =>{
    return await Invoice.find({objectDeletionStatus: false})
    .populate('vehicleID payerID')
    .then(documents => {return documents})
}

module.exports = getAllInvoicesPopulate;