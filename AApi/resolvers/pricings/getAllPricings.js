const db = require("../../models");
const Pricing = db.pricing;

const getAllPricings = async (rolename) =>{
    return await Pricing.find({})
    .then(documents => {
            return documents
        })

}

module.exports = getAllPricings;