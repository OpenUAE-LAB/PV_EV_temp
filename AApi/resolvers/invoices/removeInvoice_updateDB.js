const db = require("../../models");
const Invoice= db.invoice;


const removeInvoice_updateDB = async(chainEvent) =>{

    let invoiceChain =JSON.parse(chainEvent.payload.toString());
    
    let db_response =  await Invoice.updateOne(
        {"_id":invoiceChain['assetID'], objectDeletionStatus: false}, 
        {
            objectDeletionStatus: true,
            $push: { objectHistory: {date: Date.now(), event:"Deleted"} }
        }
    );


    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
    
}
module.exports = removeInvoice_updateDB;