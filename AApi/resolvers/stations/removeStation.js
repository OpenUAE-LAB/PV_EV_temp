const db = require("../../models");
const station = db.station;

const removeStation = async(objectID) =>{
   let db_response =  await station.updateOne(
      {"_id":objectID, objectDeletionStatus: false}, 
      {
          objectDeletionStatus: true,
      }
  );


  if (db_response.nModified){
      return true;
  }else{
      return false;
  }

}
module.exports = removeStation;


