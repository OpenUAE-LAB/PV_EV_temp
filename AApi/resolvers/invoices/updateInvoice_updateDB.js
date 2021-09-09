const db = require("../../models");
const Invoice = db.invoice;

const updateInvoice_updateDB = async (chainEvent) =>{
    invoiceChain =JSON.parse(chainEvent.payload.toString());
    Invoice.updateOne(
        { "_id": invoiceChain['assetID'] },
        {
            isPaid   : invoiceChain['isPaid'],
            wattUnits: invoiceChain['wattUnits'],
            priceTotal:invoiceChain['priceTotal'],
            $push: { objectHistory: {date: Date.now(), event:"Modified - Attribute Changed"} }
        },
        function (err, doc) {
            if (err) {
                console.log("[ updateInvoice_updateDB] Err : ", err);
            } else {
                //session is over!
                console.log("[ updateInvoice_updateDB] done ");

            }
        });
}


module.exports = updateInvoice_updateDB;