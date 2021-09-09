// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_session =require("../networkConfig.js").chaincodeNameConsumption;
const sha256 = require('../sha256.js');

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')
const removeSession_updateChain = async(Id) =>{
	// the chargingSession in a smartContract
	return await loadNetwork(channelName, chaincodeName_session).then(async (contract) => {
		try {

            console.log("[removeSession_updateChain]: Id", Id);

            return await contract.submitTransaction('remove',Id).then(() => {
                contract.addContractListener(listener, 'removeSession').then(() => {
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
module.exports = removeSession_updateChain;