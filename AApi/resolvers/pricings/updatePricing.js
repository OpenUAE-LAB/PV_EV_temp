const db = require("../../models");
const Pricing = db.pricing;

const updatePricing = async (pricingID, newPrice) =>{
    let db_response = await Pricing.updateOne({"_id":pricingID},
        {priceUnit : newPrice});


        console.log(pricingID, newPricing);
    if (db_response.nModified){
        return true;
    }else{
        return false;
    }
}
module.exports = updatePricing;