const db = require("../../models");
const Pricing = db.pricing;

const getPricingsByRole = async (rolename) =>{
    return await Pricing.find({role:rolename}).then(documents => {
            return documents
        })

}

module.exports = getPricingsByRole;