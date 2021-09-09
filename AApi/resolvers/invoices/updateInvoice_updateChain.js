// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_invoice = require("../networkConfig.js").chaincodeNameInvoice;
const sha256 = require('../sha256.js');

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')

const updateInvoice_updateChain = async (invoiceObject) =>{
	//Store the invoiceObject in a smartContract
	return await loadNetwork(channelName, chaincodeName_invoice).then(async (contract) => {
		try {
            console.log("[updateInvoice_updateChain]: invoiceObject", invoiceObject);

            let _fullRecord = invoiceObject._id.toString() + 
            invoiceObject.vehicleID.toString() + 
            invoiceObject.payerID.toString() +
            invoiceObject.payee.toString() + 
            invoiceObject.chargingSessionID.toString() + 
            invoiceObject.issueDate.toString() + 
            invoiceObject.wattUnits.toString() + 
            invoiceObject.priceTotal.toString() + 
            invoiceObject.isPaid.toString();
			
            let _hash = sha256.getHash(_fullRecord);
            
            // Submit the specified transaction.
            return await contract.submitTransaction('change',
            invoiceObject._id.toString() , 
            invoiceObject.vehicleID.toString() ,
            invoiceObject.payerID.toString() ,
            invoiceObject.payee.toString() ,
            invoiceObject.chargingSessionID.toString() ,
            invoiceObject.issueDate.toString() , 
            invoiceObject.wattUnits.toString() ,
            invoiceObject.priceTotal.toString() ,
            invoiceObject.isPaid.toString(), _hash
			).then(() => {
                contract.addContractListener(listener, 'updateInvoice').then(() => {
                    console.log({
                            message: "Transaction has been submitted"});
                    });
                return true;
            })

		} catch (error) {
			console.error(`Failed to submit transaction: ${error}`, error.line);
			return false;
		}
	})   
}



module.exports = updateInvoice_updateChain;