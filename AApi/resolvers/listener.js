const chaincodeName_invoice = require("./networkConfig.js").chaincodeNameInvoice;
const chaincodeName_session = require("./networkConfig.js").chaincodeNameConsumption;


const addSession_toDB = require("./sessions/addSession_toDB.js");
const endSession_updateDB = require("./sessions/endSession_updateDB.js");
const updateSession_updateDB = require("./sessions/updateSession_updateDB.js");
const removeSession_updateDB = require("./sessions/removeSession_updateDB.js");

const addInvoice_toDB        = require("./invoices/addInvoice_toDB.js");
const updateInvoice_updateDB = require("./invoices/updateInvoice_updateDB.js");
const removeInvoice_updateDB = require("./invoices/removeInvoice_updateDB.js");




const listener = (e) => {
    if (e.chaincodeId === chaincodeName_session ){
        switch(e.eventName) {
            case "store":
                //call generate session
                addSession_toDB(e);
                break;
            case "end":
                //call 
                endSession_updateDB(e);
                break;

            case "change":
                //call 
                updateSession_updateDB(e);
                break;
                
            case "remove":
                //call 
                removeSession_updateDB(e);
                break;                
            default:
              // code block
          }
    }else if(e.chaincodeId === chaincodeName_invoice ){
        switch(e.eventName) {
            case "store":
                //call 
                addInvoice_toDB(e);
                break;
            case "paid":
               //call 
                break;

            case "change":
                //call 
                updateInvoice_updateDB(e);
                break;
                
            case "remove":
                //call 
                removeInvoice_updateDB(e);
                break;                
            default:
              // code block
          }        
    }


    console.log(e);
    console.log("Event => ", e.eventName);
    const txnData = e.getTransactionEvent();
    console.log("Transaction Info => ", txnData);
    try{
        console.log("payload-string", e.payload.toString());
        console.log("Payload => ", JSON.parse(e.payload.toString()));
    }catch(err){
        console.log("Listener - error: ", err);
    }

    txnId = txnData.transactionId;

  };


module.exports = listener