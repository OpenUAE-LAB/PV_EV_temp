// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_invoice = require("../networkConfig.js").chaincodeNameInvoice;
const sha256 = require('../sha256.js');

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')


const removeInvoice_updateChain = async(Id) =>{
	// the Invoice in a smartContract
	return await loadNetwork(channelName, chaincodeName_invoice).then(async (contract) => {
		try {

            console.log("[removeInvoice_updateChain]: Id", Id);

            return await contract.submitTransaction('remove',Id).then(() => {
                contract.addContractListener(listener, 'removeInvoice').then(() => {
                    console.log({
                            message: "Transaction has been submitted",
                            });
                    });
                return true;
            })



        } catch (error) {
			console.error(`Failed to submit transaction: ${error}`, error.line);
			return false;
		}
	})          
}
module.exports = removeInvoice_updateChain;