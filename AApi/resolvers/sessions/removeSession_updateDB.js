const db = require("../../models");
const chargingSession= db.chargingSession;


const removeSession_updateDB = async(chainEvent) =>{

    let sessionChain =JSON.parse(chainEvent.payload.toString());
    
    let db_response =  await chargingSession.updateOne(
        {"_id":sessionChain['assetID'], objectDeletionStatus: false}, 
        {
            objectDeletionStatus: true,
            $push: { objectHistory: {date: Date.now(), event:"Deleted"} }
        }
    );


    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
    
}
module.exports = removeSession_updateDB;