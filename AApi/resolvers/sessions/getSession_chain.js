// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_session =require("../networkConfig.js").chaincodeNameConsumption;

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");

const getSession_chain = async (Id) =>{
	//Store the chargingSession in a smartContract
        return await loadNetwork(channelName, chaincodeName_session).then(async (contract) => {
            let result = await contract.evaluateTransaction('get', Id);
            //console.log("results", JSON.parse(result.toString()));
            result = JSON.parse(result.toString());
            return result;
        });
    }
module.exports = getSession_chain;