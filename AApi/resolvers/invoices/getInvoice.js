const db = require("../../models");
const Invoice = db.invoice;

const getInvoice = async(id) => { 
    return await Invoice.find({ "_id": id, objectDeletionStatus: false})
    .then(documents => { return documents})
}


module.exports = getInvoice;