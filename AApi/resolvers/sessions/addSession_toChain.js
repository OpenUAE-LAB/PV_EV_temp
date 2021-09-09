// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_session = require("../networkConfig.js").chaincodeNameConsumption;
const sha256 = require('../sha256.js');
const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')

//DB RELATED
const db = require("../../models");
const chargingSession = db.chargingSession;

const addSession_toChain = async (vehicleID, driverID,stationID,  initalChargingPercentage) =>{
	//Store the chargingSession in a smartContract

	const cSessionRecord = new chargingSession({
		vehicleID:vehicleID,
		driverID: driverID,
		stationID: stationID,
		initalChargingPercentage: initalChargingPercentage,
		endChargingPercentage:-1,
		startDate: Date.now(),
		chargedPower: 0,
		endDate:0,          
	});

	return  await loadNetwork(channelName, chaincodeName_session).then(async (contract) => {
		try {
            console.log("cSessionRecord", cSessionRecord);
            console.log("data", cSessionRecord._id,
			cSessionRecord.stationID, cSessionRecord.driverID,
            cSessionRecord.vehicleID, cSessionRecord.chargedPower, 
            cSessionRecord.startDate, cSessionRecord.endDate,
            cSessionRecord.initalChargingPercentage, cSessionRecord.endChargingPercentage
            );


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
			console.log('Generated hash for cSession', _hash);
			// Submit the specified transaction.
			return await contract.submitTransaction('store', cSessionRecord._id,
			cSessionRecord.stationID, cSessionRecord.driverID,
            cSessionRecord.vehicleID, cSessionRecord.chargedPower, 
            cSessionRecord.startDate, cSessionRecord.endDate,
            cSessionRecord.initalChargingPercentage, cSessionRecord.endChargingPercentage, _hash)
			.then(() => {
                contract.addContractListener(listener, 'store').then(() => {
                    console.log("Transaction has been submitted");
                    });
                return [true, cSessionRecord];
            })

		} catch (error) {
			console.error(`Failed to submit transaction: ${error}`, error.line);
			return [false];
		}
	})  
}
module.exports = addSession_toChain;