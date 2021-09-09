const db = require("../../models");
const chargingSession = db.chargingSession;


const addSession_toDB = async (chainEvent) =>{
    sessionChain =JSON.parse(chainEvent.payload.toString());
    const sessionObj = new chargingSession(
    {   "_id": sessionChain['assetID'] ,
        vehicleID: sessionChain['vehicle'], 
        driverID: sessionChain['consumer'], 
        stationID: sessionChain['station'], 
        initalChargingPercentage: sessionChain['initalChargingPercentage'],
        startDate: sessionChain['startDateTime'],
        chargedPower: sessionChain['amount'],
        active: true,
        objectDeletionStatus: false,
        objectHistory: [{date:sessionChain['startDateTime'], event:"Created"}]   
    });
    sessionObj.isNew = true;
    return await sessionObj.save((err, sessionObj) => {
        if (err) {
            console.log('errorhappended')
            console.log({ message: err });
            return;
        } else {
            console.log({ message: "A charging session starting event has been saved in DB successfully!", data: sessionObj });
        }
    });
}


module.exports = addSession_toDB;