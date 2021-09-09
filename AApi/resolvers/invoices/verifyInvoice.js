const getInvoicePopulate = require('../invoices/getInvoicePopulate')
const getInvoice_chain = require('../invoices/getInvoice_chain.js')
const sha256 = require('../sha256.js');


const verifyInvoice = async (Id) =>{
    //Store the Invoice in a smartContract
    try{
        let obj_db    = await getInvoicePopulate(Id);//get the invoice from database
        console.log(obj_db);
        let obj_chain = await getInvoice_chain(Id);//get the invoice from chain

        obj_db = obj_db[0].toObject();

        let _fullRecord = obj_db._id.toString() + 
        obj_db.vehicleID._id.toString() + 
        obj_db.payerID._id.toString() +
        obj_db.payee.toString() + 
        obj_db.chargingSessionID._id.toString() + 
        obj_db.issueDate.toString() + 
        obj_db.wattUnits.toString() + 
        obj_db.priceTotal.toString() + 
        obj_db.isPaid.toString() ;

        console.log(_fullRecord, "--view--");
        let _hash = sha256.getHash(_fullRecord);
        var verified = false;
        if (_hash == obj_chain.hash) {
            verified = true;
        }
        obj_db.verified = verified;
        obj_db.blockchainRecord = obj_chain;
        console.log('verifyInvoice - after ver :', obj_db);
        return obj_db;
    }catch(err){
        console.log("[ verifyInvoice] Err : ", err);
        return {};
    }
}

module.exports = verifyInvoice;