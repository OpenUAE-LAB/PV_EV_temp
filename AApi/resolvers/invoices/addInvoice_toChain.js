// LEDGER RELATED 
const channelName = require('../networkConfig.js').channelName ;
const chaincodeName_invoice = require("../networkConfig.js").chaincodeNameInvoice;
const sha256 = require('../sha256.js');

const loadNetwork = require("../../pv/services/network-service.js")
const helper = require("../../helper.js");
const listener=require('../listener.js')


const DriverServices = require("../driver");

//DB RELATED
const db = require("../../models");
const Invoice = db.invoice;


const addInvoice_toChain = async (cSessionRecord) =>{
    let pricing = await DriverServices.getUserPricing(cSessionRecord.driverID);
    console.log("[addInvoice_toChain] pricing", pricing)
    if (pricing.length == 0){
        return [false];
    }
    return await loadNetwork(channelName, chaincodeName_invoice).then(async (contract) => {
        try {
            let pricingUnit = pricing[0].priceUnit;
            let wattUnits = cSessionRecord.chargedPower;
            //Calculate the totalprice 
            let priceTotal = pricingUnit * wattUnits;
            let issueDate = Date.now();
            // Add an NEW Invcoie
            const newInvoice = new Invoice({
                vehicleID: cSessionRecord.vehicleID,
                payerID: cSessionRecord.driverID,
                payee: "Energy Department",
                chargingSessionID: cSessionRecord._id,   
                issueDate: issueDate,
                wattUnits: wattUnits,
                priceTotal: priceTotal,
                isPaid: false

            }); 
            
            console.log("newInvoice" , newInvoice);


            let _fullRecord = newInvoice._id.toString() + 
            newInvoice.vehicleID.toString() + 
            newInvoice.payerID.toString() +
            newInvoice.payee.toString() + 
            newInvoice.chargingSessionID.toString() + 
            newInvoice.issueDate.toString() + 
            newInvoice.wattUnits.toString() + 
            newInvoice.priceTotal.toString() + 
            newInvoice.isPaid.toString() ;

            let _hash = sha256.getHash(_fullRecord);

            // Submit the specified transaction.
            return await contract.submitTransaction('store',
            newInvoice._id.toString() , 
            newInvoice.vehicleID.toString() ,
            newInvoice.payerID.toString() ,
            newInvoice.payee.toString() ,
            newInvoice.chargingSessionID.toString() ,
            newInvoice.issueDate.toString() , 
            newInvoice.wattUnits.toString() ,
            newInvoice.priceTotal.toString() ,
            newInvoice.isPaid.toString(), _hash
            ).then(() => {
                contract.addContractListener(listener, 'createInvoice').then(() => {
                    console.log("Transaction has been submitted");
                });

                console.log("_hash", true, newInvoice);
                return [true, newInvoice];
            })   
        }catch (error) {
            console.error(`Failed to submit transaction - addInvoice_toChain: ${error}`, error.line);
            return [false];
        }    
    })
}

module.exports = addInvoice_toChain;