const InvoiceService = require("./../../resolvers/invoices");
var ObjectId = require('mongoose').Types.ObjectId;


const VIEW_INVOICE= {

    viewInvoices: async(req,res) =>{
        try{
            let objects = await InvoiceService.getAllInvoicesPopulate();
            res.status(200).json({data:objects});
        }catch(err){
            res.status(500).send({ message: err });
        }

    },
    viewRemovedInvoices: async(req,res) =>{
        try{
            let objects = await InvoiceService.getAllRemovedInvoices();
            res.status(200).json({data:objects});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    verifyInvoice: async(req,res) =>{
        const invoiceID= req.params.id;
        if (ObjectId.isValid(invoiceID)){
            try{
                let invoiceObj = await InvoiceService.verifyInvoice(invoiceID);
                res.status(200).json({data:invoiceObj});
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }

    },
    modifyInvoice: async(req,res) =>{
        const invoiceID = req.params.id;
        const wattUnits = req.body.wattUnits;
        const isPaid    = req.body.isPaid;
        const priceTotal    = req.body.priceTotal;
       

        InvoiceService.getInvoice(invoiceID).then(async(objects)=>{
            if (objects.length == 0){
                    res.status(500).send({ message: "The invoice requested does't exist!" });
            }else{
                let invoiceObj = objects[0];
                console.log('modifyInvoice - invoiceObj',invoiceObj);
                if (typeof wattUnits !== 'undefined' && wattUnits !== null){
                    invoiceObj.wattUnits = wattUnits;
                }
                if (typeof isPaid !== 'undefined' && isPaid !== null){
                    invoiceObj.isPaid = isPaid;
                }  
                
                if (typeof priceTotal !== 'undefined' && priceTotal !== null){
                    invoiceObj.priceTotal = priceTotal;
                }  
                if (await InvoiceService.updateInvoice_updateChain(invoiceObj)){
                    //start generating an invoice
                    res.status(200).send({ message: `The invoice with ID:[${invoiceID}]`, data:{invoiceObj}});
                }else{
                    res.status(500).send({ message: "The invoice did not get updated correctly! Contact Admin" });
                }										
            }
        });
    },
    removeInvoice: async(req,res) =>{

        const invoiceID= req.params.id;
        if (ObjectId.isValid(invoiceID)){
            try{
                if(await InvoiceService.removeInvoice_updateChain(invoiceID)){
                    res.status(200).send({ message: "An invoice has been cancelled successfully!" });
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
module.exports = VIEW_INVOICE;
