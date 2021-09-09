var ObjectId = require('mongoose').Types.ObjectId;
const PricingService = require("./../../resolvers/pricings");


const VIEW_C_PRICING = {

    viewPricing: async(req,res) =>{
        try{
            let dvaObjs = await PricingService.getAllPricings();

            res.status(200).json({data:dvaObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    modifyPricing: async(req,res) =>{
        const pricingID  = req.params.id;
        const newPricing = req.body.priceUnit;
        if (ObjectId.isValid(pricingID)){
            try{
                if(await PricingService.updatePricing(pricingID, newPricing)){
                    res.status(200).send({ message: "The price unit has been updated successfully!" });
                }else{
                    res.status(400).send({ message: "This  ID was not found!" });
                }               
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    }


}

module.exports = VIEW_C_PRICING;