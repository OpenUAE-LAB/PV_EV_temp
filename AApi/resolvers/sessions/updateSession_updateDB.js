const db = require("../../models");
const chargingSession = db.chargingSession;


const updateSession_updateDB = (chainEvent) =>{
    //Store in the Database with txHash
    sessionChain =JSON.parse(chainEvent.payload.toString());
    
    chargingSession.updateOne(
        { "_id": sessionChain['assetID'] , active: false },
        {
            chargedPower: sessionChain['amount'],
            endChargingPercentage: sessionChain['endChargingPercentage'],
            $push: { objectHistory: {date: Date.now(), event:"Modified - Attribute Changed"} }
        },
        function (err, doc) {
            if (err) {
                console.log("[ updateSession] Err : ", err);
            } else {
                //session is over!
                console.log("[ updateSession] done ");

            }
        });
    }


module.exports = updateSession_updateDB;

