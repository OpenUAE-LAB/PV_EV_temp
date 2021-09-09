const logging = require("../../resolvers//logging.js");



var ObjectId = require('mongoose').Types.ObjectId;
// /const { v4: uuidv4 } = require('uuid');


const SessionService = require("./../../resolvers/sessions");
const DriverService  = require("./../../resolvers/driver");
const InvoiceService = require("./../../resolvers/invoices");

const VIEW_C_SESSIONS = {

    veiwSessions: async(req, res) => {
        try{
            let sessionObjs = await SessionService.getAllSessionsPopulate();
            res.status(200).json({data:sessionObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    veiwRemovedSessions: async(req, res) => {
        try{
            let sessionObjs = await SessionService.getAllRemovedSessions();
            res.status(200).json({data:sessionObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    veiwSessionByDriver: async(req, res) => {

        let driverID = req.body.driverID;
        if (ObjectId.isValid(driverID)){
            try{
                let sessionObjs = await SessionService.getAllSessionsByDriverID(driverID);
                res.status(200).json({data:sessionObjs});
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    initiateSession: async (req, res) => {
        let driverID  = req.body.driverID;
        let vehicleID = req.body.vehicleID;
        let stationID = req.body.stationID;
        let initalChargingPercentage = req.body.initalChargingPercentage;

        //Check if the driver has valid roles & prices
        let hasPricing =  await DriverService.getUserPricing(driverID);
        console.log('dd', hasPricing);
        if(hasPricing){
            // proceed with the session    
            let ledgerObj = await SessionService.addSession_toChain(vehicleID, driverID,stationID,  initalChargingPercentage);
            if (ledgerObj[0]){
                res.status(201).send({ message: "A charging session starting event has been saved in blockchain successfully!", data: ledgerObj[1] });
            }else{
                res.status(500).send({ message: "The session didn't get initiated correctly! Contact Admin" });
            }

        }else{        
            //user is invalid
            res.status(500).send({ message: "The Driver ID is not valid, or pricing was found for the driver role." });

        }

    },
    endSession: async(req, res) => {


        const cSessionID = req.body.cSessionID;
        const endChargingPercentage = req.body.endChargingPercentage;
        const endDate = Date.now();
    
        //Get the charging session using sessionID - if session is not active (ended already), flag an error
        SessionService.getActiveSessionbyID(cSessionID).then(async(cSession)=>{
            if (cSession.length == 0){
                    res.status(500).send({ message: "The charging session requested does't exist or it is over already!" });
            }else{
                let sessionObj = cSession[0];
                //update chain by "Ending the session"      
                sessionObj.endDate  = endDate;
                sessionObj.endChargingPercentage = endChargingPercentage;
                try{
                    if (await SessionService.endSession_updateChain(sessionObj)){
                        //start generating an invoice
                        let invoiceObj = await InvoiceService.addInvoice_toChain(sessionObj);
                        console.log('invoiceObj', invoiceObj);
                        if (invoiceObj[0]){
                            res.status(200).send({ message: `The charing session with ID:[${cSessionID}] endded seccuessfully and the invoice was genearted sucessully`,
                            data:{"session": sessionObj, "invoice": invoiceObj[1]}});
                        }else{
                            res.status(500).send({ message: `The charing session with ID:[${cSessionID}] endded seccuessfully but the invoice generation failed`,
                            data:{"session": sessionObj}});
                        }
                    }else{
                        res.status(500).send({ message: "The session did not end correctly! Contact Admin" });
                    }	
                }catch(err){
                    console.log("endSession - err: ", err)
                }									
            }
        });
    },
    modifySession: async(req, res) => {

        const cSessionID = req.params.id;
        const endChargingPercentage = req.body.endChargingPercentage;
        const chargedPower = req.body.chargedPower;

        //Get the charging session using sessionID - if session is not active (ended already), flag an error
       
        SessionService.getSessionFinished(cSessionID).then(async(cSession)=>{
            if (cSession.length == 0){
                    res.status(500).send({ message: "The charging session requested does't exist or it is still running!" });
            }else{
                let sessionObj = cSession[0];
                //console.log('modifySession - sessionObj',sessionObj);

                //update chain by "Ending the session"      
                if (typeof chargedPower !== 'undefined' && chargedPower !== null){
                    sessionObj.chargedPower = chargedPower;
                }
                if (typeof endChargingPercentage !== 'undefined' && endChargingPercentage !== null){
                    sessionObj.endChargingPercentage = endChargingPercentage;
                }           
                if (await SessionService.updateSession_updateChain(sessionObj)){
                    logging.addLog("PV - VIEW_C_SESSIONS", "modifySession", 131, `The charing session with ID:[${cSessionID}] got updated.` );
                    //start generating an invoice
                    res.status(200).send({ message: `The charing session with ID:[${cSessionID}]`, data:{sessionObj}});

                }else{
                    res.status(500).send({ message: "The session did not get updated correctly! Contact Admin" });
                    logging.addLog("PV - VIEW_C_SESSIONS", "modifySession", 137, `Failed to update the charing session with ID:[${cSessionID}]` );
                }										
            }
        });
    },
    verifySession: async(req, res) => {
        const sessionID= req.params.id;
        if (ObjectId.isValid(sessionID)){
            try{
                let sessionObj = await SessionService.verifySession(sessionID);
                res.status(200).json({data:sessionObj});
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    removeSession: async(req, res) =>{
        const sessionID= req.params.id;
        if (ObjectId.isValid(sessionID)){
            try{
                if(await SessionService.removeSession_updateChain(sessionID)){
                    res.status(200).send({ message: "A session has been cancelled successfully!" });
                }else{
                    res.status(400).send({ message: 'No object got modified' });
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


module.exports = VIEW_C_SESSIONS;