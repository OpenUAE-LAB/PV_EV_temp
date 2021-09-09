const db = require("../../models");
const chargingSession = db.chargingSession;



const endSession_updateDB = async(chainEvent) =>{
    //Store in the Database with txHash
    sessionChain =JSON.parse(chainEvent.payload.toString());
    
    return await chargingSession.updateOne(
        { "_id": sessionChain['assetID'] , active: true },
        {
            endDate: sessionChain['endDateTime'],
            endChargingPercentage: sessionChain['endChargingPercentage'],
            active: false,
            $push: { objectHistory: {date: sessionChain['endDateTime'], event:"Modified - Session Ended"} }
        },
        function (err, doc) {
            if (err) {
                console.log("[endSession] Err : ", err);
            } else {
                //session is over!
                console.log("[endSession] done ");

            }
        });
    }



module.exports = endSession_updateDB;
