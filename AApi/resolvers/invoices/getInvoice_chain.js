// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_invoice = require("../networkConfig.js").chaincodeNameInvoice;
const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");



const getInvoice_chain = async (Id) =>{
        return await loadNetwork(channelName, chaincodeName_invoice).then(async (contract) => {
            try{
                let result = await contract.evaluateTransaction('get', Id);
                result = JSON.parse(result.toString());
                return result;
            }catch(err){
                console.log('[getInvoice_chain] Error: ', err);
                return [];
            }

        });
    }
module.exports = getInvoice_chain;