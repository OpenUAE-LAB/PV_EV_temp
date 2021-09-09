const logging = require("../../resolvers/logging.js");

var ObjectId = require('mongoose').Types.ObjectId;
const axios = require('axios');
const config = require("../.config/server-config");
const SessionService = require("./../../resolvers/sessions");

const { check, validationResult } = require("express-validator");



const VIEW_C_SESSIONS = {

    veiwSession: async(req,res) =>{
        try{
            let sessionObjs = await SessionService.getAllSessionsPopulate();
            res.status(200).json({data:sessionObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    verifySession: async(req,res) =>{
        const sessionID  = req.params.id;
        if (ObjectId.isValid(sessionID)){
            const instance = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': config.PV_API_TOKEN
                }
            });

            instance.get(`${config.PV_LINK}:${config.PV_PORT}/csession/verifySession/${sessionID}`)
            .then((response) => {
                //Add a new session
                if (response.status == 200 ){
                    //The session was added successfully. 
                    res.status(200).send({data:response.data.data });
                }else{
                    //The session wasn't addedd sucessfully
                    res.status(500).send({ message: "Error! " + response.data.message });
    
                }
            })
            .catch((err) =>{               
                var ErrorMessage = null;
                console.log(err);
                try{
                    if(err.code ==  'ECONNREFUSED'){
                        //The other server is not working
                        ErrorMessage = "The PV Server might not be working as connection is refused."
                    }else{
                        ErrorMessage = err.code 
                        try{
                            ErrorMessage = err.response.data.message
                        }catch(err){
                            console.log("[VIEW_C_SESSIONS:verifySession] ", err)
                            logging.addLog("EV - VIEW_C_SESSIONS", "verifySession", 57, `Err: ${err}`);
                        }
                    }
    
                }catch(err) {
                    console.log("[VIEW_C_SESSIONS:verifySession] ",err);
                    logging.addLog("EV - VIEW_C_SESSIONS", "verifySession", 63, `Err: ${err}`);
                    ErrorMessage = err.code 
                }
                console.log(ErrorMessage);
                res.status(500).send({ message: ErrorMessage});
            });
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },   
    veiwMySessions: async(req,res) =>{ //function accessiable by drivers   
        try{
            let sessionObjs = await SessionService.getAllSessionsByDriverID(req.userId);
            res.status(200).json({data:sessionObjs});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    veiwSessionByDriver: async(req,res) =>{
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
    startSession: async(req,res) =>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
          return res.status(400).json({ errors: errors.array() });
        }


        //request a new session from PV                     
        const instance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': config.PV_API_TOKEN
            }
        });
        
        instance.post(`${config.PV_LINK}:${config.PV_PORT}/api/csession/initiateSession`,{
            "vehicleID" :req.body.vehicleID,
            "driverID" :req.userId,
            "stationID" :req.body.stationID,
            "initalChargingPercentage":req.body.initalChargingPercentage,                
        })
        .then((response) => {
            //Add a new session
            if ((response.status == 200 )|| (response.status == 201)){
                //The session was added successfully. 
                res.status(200).send({ message: "A charging session starting event has been saved in DB successfully!", data:response.data.data });
                logging.addLog("EV - VIEW_C_SESSIONS", "startSession", 125, `A charging session starting event has been saved in DB successfully!: ${response.data.data}`);

            }else{
                //The session wasn't addedd sucessfully
                res.status(500).send({ message: "A charging session didn't start successfully! " + response.data.message });
                logging.addLog("EV - VIEW_C_SESSIONS", "startSession", 130, `A charging session didn't start successfully! " + ${response.data.message}` );

            }
        })
        .catch((err) =>{
            var ErrorMessage = null;
            try{
                if(err.code ==  'ECONNREFUSED'){
                    //The other server is not working
                    ErrorMessage = "The PV Server might not be working as connection is refused."
                }else{
                    ErrorMessage = err.code 

                }

            }catch(err) {
                console.log("[VIEW_C_SESSIONS:startSession] ",err);
                logging.addLog("EV - VIEW_C_SESSIONS", "startSession", 147, `A charging session didn't start successfully! " + response.data.message` );
                ErrorMessage = err.code 
            }
            res.status(500).send({ message: ErrorMessage});
        });
    },
    endSession: async(req,res) =>{
        const cSessionID  = req.params.id;
        if (ObjectId.isValid(cSessionID)){
            const instance = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': config.PV_API_TOKEN
                }
            });
            
            instance.put(`${config.PV_LINK}:${config.PV_PORT}/api/csession/endSession`,{
                "cSessionID" :cSessionID,
                "endChargingPercentage" :req.body.endChargingPercentage               
            })
            .then((response) => {
                //End a session
                console.log(response.data);
                logging.addLog("EV - VIEW_C_SESSIONS", "endSession", 170, `Session ended sucessfully ${cSessionID}` );
                //The session was ended successfully. 
                res.status(200).send(response.data);
            })
            .catch((err) =>{

                var ErrorMessage = null;
                try{
                    if(err.code ==  'ECONNREFUSED'){
                        //The other server is not working
                        ErrorMessage = "The PV Server might not be working as connection is refused.";
                    }else{
                        console.log(err.response);
                        ErrorMessage =err.response.data.message
                    }
    
                }catch(err) {
                    console.log("[VIEW_INVOICES:viewInvoiceWithVerification] ",err);
                    ErrorMessage = err.code 
                }
                logging.addLog("EV - VIEW_C_SESSIONS", "endSession", 190, `Err: ${ErrorMessage}` );
                res.status(500).send({ message: ErrorMessage});
            });
        }else{ 
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});
        }
    },
    deleteSession: (req,res) =>{ 
        const cSessionID = req.params.id;
        if (ObjectId.isValid(cSessionID)){
            const instance = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': config.PV_API_TOKEN
                }
            });
            instance.put(`${config.PV_LINK}:${config.PV_PORT}/csession/deleteSession`)
            .then((response) => {
                //Add a new session
                if (response.status == 200 ){
                    //The session was added successfully. 
                    res.status(200).send({message:response.data.message });
                    logging.addLog("EV - VIEW_C_SESSIONS", "deleteSession", 213, `Session deleted sucessfully ID: ${cSessionID}` );
                }else{
                    //The session wasn't addedd sucessfully
                    res.status(500).send({ message: "Error! " + response.data.message });
    
                }
            })
            .catch((err) =>{               
                var ErrorMessage = null;
                console.log(err);
                try{
                    if(err.code ==  'ECONNREFUSED'){
                        //The other server is not working
                        ErrorMessage = "The PV Server might not be working as connection is refused."
                    }else{
                        ErrorMessage = err.code 
                        try{
                            ErrorMessage = err.response.data.message
                        }catch(err){
                            console.log("[VIEW_C_SESSIONS:deleteSession] ", err)
                        }
                    }
    
                }catch(err) {
                    console.log("[VIEW_C_SESSIONS:deleteSession] ",err);
                    ErrorMessage = err.code 
                }
                console.log(ErrorMessage);
                logging.addLog("EV - VIEW_C_SESSIONS", "deleteSession", 241, `Err: ${ErrorMessage}` );
                res.status(500).send({ message: ErrorMessage});
            });

        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    veiwRemovedSessions: async(req, res) => {
        try{
            let sessionObjs = await SessionService.getAllRemovedSessions();
            res.status(200).json({data:sessionObjs});
            
        }catch(err){
            res.status(500).send({ message: err });
        }
    }
}



module.exports = VIEW_C_SESSIONS;