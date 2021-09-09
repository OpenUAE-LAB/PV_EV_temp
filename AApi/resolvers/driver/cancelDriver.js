const db = require("../../models");
const User=  db.user;


const cancelDriver = async(userID) =>{
    let = await User.updateOne(
                {"_id":userID},
                {active : false}
            );
    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
}
module.exports = cancelDriver;