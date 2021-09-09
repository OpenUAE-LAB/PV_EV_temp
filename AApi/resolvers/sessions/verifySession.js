const getSessionPopulate = require('../sessions/getSessionPopulate.js')
const getSession_chain = require('../sessions/getSession_chain.js')
const sha256 = require('../sha256.js');


const verifySesion = async (Id) =>{
    //Store the chargingSession in a smartContract
    try{
        let obj_db    = await getSessionPopulate(Id);//get the session from database
        let obj_chain = await getSession_chain(Id);//get the session from chain
        obj_db = obj_db[0].toObject();
        console.log("obj_db", obj_db);
        let _fullRecord = obj_db._id.toString() +
        obj_db.stationID._id.toString() +
        obj_db.driverID._id.toString() +
        obj_db.chargedPower.toString() +
        obj_db.startDate.toString() +
        obj_db.endDate.toString() +
        obj_db.vehicleID._id.toString() +
        obj_db.initalChargingPercentage.toString() +
        obj_db.endChargingPercentage.toString()

        console.log(_fullRecord, "--view--");
        let _hash = sha256.getHash(_fullRecord);
        var verified = false;
        if (_hash == obj_chain.hash) {
            verified = true
        }
        obj_db.verified = verified;
        obj_db.blockchainRecord = obj_chain;
        console.log('verifySesion - after ver :', obj_db);
        return obj_db;
    }catch(err){
        console.log("[ verifySesion] Err : ", err);
    }
}

module.exports = verifySesion;