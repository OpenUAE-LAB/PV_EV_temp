
var ObjectId = require('mongoose').Types.ObjectId;
const axios = require('axios');
const config = require("../.config/server-config");
const InvoiceService = require("./../../resolvers/invoices");

const VIEW_INVOICE= {

    viewInvoice: async (req,res) =>{
        try{
            let objects = await InvoiceService.getAllInvoicesPopulate();
            res.status(200).json({data:objects});
        }catch(err){
            res.status(500).send({ message: err });
        }


    },
    veiwMyInvoices: async (req,res) =>{ //function accessiable by drivers  
        try{
            let objects = await InvoiceService.getAllInvoicesByDriverID(req.userId);
            res.status(200).json({data:objects});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    verifyInvoice: async(req,res) =>{

        const invoiceID= req.params.id;
        const instance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': config.PV_API_TOKEN
            }
        });
        instance.get(`${config.PV_LINK}:${config.PV_PORT}/api/invoice/verifyInvoice/${invoiceID}`,)
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
            try{
                if(err.code ==  'ECONNREFUSED'){
                    //The other server is not working
                    ErrorMessage = "The PV Server might not be working as connection is refused."
                }else{
                    ErrorMessage = err.code 

                }

            }catch(err) {
                console.log("[VIEW_INVOICES: verifyInvoice] ",err);
                ErrorMessage = err.code 
            }
            res.status(500).send({ message: ErrorMessage});
        });
        
    },
    getInvoiceHTML: async(req,res) =>{
        const invoiceID = req.params.id;
        console.log("getInvoiceHTML ->");
        if (ObjectId.isValid(invoiceID)){
            let documents =  await InvoiceService.getInvoicePopulate(invoiceID)
            try{
                if(documents.length  > 0 ){
                    data = {
                        "invoiceId": documents[0]._id,
                        "driverId": documents[0].payerID._id,
                        "vehicleId": documents[0].vehicleID._id,
                        "vehicleNumber": documents[0].vehicleID.vehicleNumber,
                        "fname" : documents[0].payerID.firstname,
                        "lname" : documents[0].payerID.lastname,
                        "payee": documents[0].payee,
                        "chargingSessionID": documents[0].chargingSessionID,
                        "date": documents[0].updateDate,
                        "priceTotal": documents[0].priceTotal,
                        "wattUnits": documents[0].wattUnits,
                        "pricePerUnit": (documents[0].wattUnits === 0) ? 0 : documents[0].priceTotal / documents[0].wattUnits, 
                        "BC_assetID ": documents[0]._id
                    }
                    res.render("invoice",{data} );
                } else{
                res.status(404).send({ message: "No Invoice found for this Invoice ID" });
                }   
            }catch(err){
                console.log("err", err);
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    },
    getInvoiceHTMLBySessionID: async(req,res) =>{
        const SessionID = req.params.id;
        console.log("getInvoiceHTMLBySessionID ->");
        if (ObjectId.isValid(SessionID)){
            let documents =  await InvoiceService.getInvoiceBySessionID(SessionID);
            try{
                if(documents.length  > 0 ){
                    data = {
                        "invoiceId": documents[0]._id,
                        "driverId": documents[0].payerID._id,
                        "vehicleId": documents[0].vehicleID._id,
                        "vehicleNumber": documents[0].vehicleID.vehicleNumber,
                        "fname" : documents[0].payerID.firstname,
                        "lname" : documents[0].payerID.lastname,
                        "payee": documents[0].payee,
                        "chargingSessionID": documents[0].chargingSessionID,
                        "date": documents[0].updateDate,
                        "priceTotal": documents[0].priceTotal,
                        "wattUnits": documents[0].wattUnits,
                        "pricePerUnit": (documents[0].wattUnits === 0) ? 0 : documents[0].priceTotal / documents[0].wattUnits, 
                        "BC_assetID ": documents[0]._id
                    }
                    res.render("invoice",{data} );
                } else{
                res.status(404).send({ message: "No Invoice found for this Session ID" });
                }   
            }catch(err){
                console.log("err", err);
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }
    }
}
module.exports = VIEW_INVOICE;
