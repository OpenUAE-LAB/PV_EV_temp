const db = require("../../models");
const Invoice = db.invoice;


const getAllRemovedInvoices = async() =>{
    const objects = await Invoice.find({objectDeletionStatus: true});
    return objects;
}

module.exports = getAllRemovedInvoices;