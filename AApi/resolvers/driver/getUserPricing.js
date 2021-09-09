const db = require("../../models");
const User=  db.user;

const pricingServices = require("../pricings");

const getUserPricing = async (driverID)=>{
    console.log("driverID", driverID);
    return User.find({_id: driverID}).populate("roles").then(async (documents) => { 
        if (documents.length){
            let driverRole = documents[0].roles[0].name;
            let pricingObj = await pricingServices.getPricingsByRole(driverRole);
            if (pricingObj.length){
                return pricingObj; 

            }else{
                console.log(`[getUserPricing]: No pricing for this role [${pricingObj}]`);
                return [];
            }
        }else{
            console.log("[getUserPricing]: No user account was found for this ID");
            return [];
        }
    })
}


module.exports = getUserPricing;