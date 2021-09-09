// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_session = require("../networkConfig.js").chaincodeNameConsumption;
const sha256 = require('../sha256.js');

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')

const updateSession_updateChain = async (cSessionRecord) =>{
	//Store the chargingSession in a smartContract
	return await loadNetwork(channelName, chaincodeName_session).then(async (contract) => {
		try {
            console.log("[updateSession_updateChain]: cSessionRecord", cSessionRecord);
			let _fullRecord = cSessionRecord._id.toString() +
			cSessionRecord.stationID.toString() +
			cSessionRecord.driverID.toString() +
			cSessionRecord.chargedPower.toString() +
			cSessionRecord.startDate.toString() +
			cSessionRecord.endDate.toString() +
			cSessionRecord.vehicleID.toString() +
			cSessionRecord.initalChargingPercentage.toString() +
			cSessionRecord.endChargingPercentage.toString();


			let _hash = sha256.getHash(_fullRecord);
			//console.log('Generated hash for cSession', _hash);
			// Submit the specified transaction.
			return await contract.submitTransaction('change', cSessionRecord._id,
			cSessionRecord.stationID, cSessionRecord.driverID,
            cSessionRecord.vehicleID, cSessionRecord.chargedPower, 
            cSessionRecord.startDate, cSessionRecord.endDate,
            cSessionRecord.initalChargingPercentage, cSessionRecord.endChargingPercentage, _hash)
			.then(() => {
                contract.addContractListener(listener, 'updateSession').then(() => {
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



module.exports = updateSession_updateChain;