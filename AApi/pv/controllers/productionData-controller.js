const db = require("../../models");
const productionData = db.productionData;
var ObjectId = require('mongoose').Types.ObjectId;

// LEDGER RELATED 
const channelName = require('./../../resolvers/networkConfig.js').channelName ;
const chaincodeName_production = require('./../../resolvers/networkConfig.js').chaincodeName_production;
const sha256 = require('../../resolvers/sha256.js');
const loadNetwork = require("../services/network-service.js")
const helper = require("../../helper.js");


//to parse the data
var Promise = require('bluebird');


const VIEW_PRODUCTION= {

    viewProductionData: (req,res) =>{

        productionData.find({}, function(err, documents) {
            if(err) {
                res.status(500).send({ message: err });
            } else {
                res.status(200).json({data:documents});
            }
          });
    },
    viewProductionDataDayWithVerification: (req,res) =>{
        var today = new Date();
        let numberofDates =  3;//req.params.id;
        if(typeof(numberofDates) == undefined){
            numberofDates = 2;
        }
        today.setDate(today.getDate() - numberofDates);

        loadNetwork(channelName, chaincodeName_production).then(async (contract) => {
            //call database
            productionData.find({"endTimeStamp":{"$gte":today}}, async function(err, documents){
                if(err){
                    res.status(500).send({ message: err });

                }else{

                    try{

                        const data = await Promise.map(documents, async (doc) => {
                            var document = doc.toObject(); 
                            let verified = false;
                            let key = document.txHash;  
                            // Evaluate the specified transaction.
                            let result = await contract.evaluateTransaction('get', key);
                            result = JSON.parse(result.toString()) //Array of data

                            if (result.length != 0){
                                result = JSON.parse(result[0].toString().replace('\\', ''));
                                let _fullRecord = document.stationName.toString() + document.weather.toString() + 
                                document.producedWattUnits.toString() + document.batteryID.toString() + 
                                document.batteryLevel.toString() + document.startTimeStamp.toString() + 
                                document.endTimeStamp.toString();
                                
                                let _hash = sha256.getHash(_fullRecord);    
                                if(_hash == result.hash){
                                    verified = true
                                }
                                
                            }


                            document.verified = verified;
                            return document;
                        }, {concurrency: 2});
                        console.log("viewProductionDataDayWithVerification- ", data.length);

                        res.status(200).send({ data: data });
                    }catch(error){
                        console.log(error);
                        res.status(500).send({ message: error });

                    }
                }
            });

        }); 
    },
    viewProductionDataDay:(req,res) =>{
        var today = new Date();
        let numberofDates =  req.params.id;
        if(typeof(numberofDates) == undefined){
            numberofDates = 2;
        }
        today.setDate(today.getDate() - numberofDates);

        productionData.find({}, function(err, documents) {
            if(err) {
                res.status(500).send({ message: err });
            } else {
                res.status(200).json({data:documents});
            }
          });
    },
    deleteProductionData: (req,res) =>{
        const prodDataID= req.params.id;
        if (ObjectId.isValid(prodDataID)){
            productionData.findByIdAndDelete(prodDataID, 
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        res.status(200).send({ message: "A production record has been deleted successfully!" });
                    }    
                }
            );
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    }
}
module.exports = VIEW_PRODUCTION;