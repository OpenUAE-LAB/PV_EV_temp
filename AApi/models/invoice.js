const mongoose = require("mongoose");

const Invoice = mongoose.model(
    "Invoice",
    new mongoose.Schema({
        vehicleID  : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        },
        payerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        payee: String,
        chargingSessionID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChargingSession'
        },
        wattUnits: Number,
        priceTotal: Number,
        issueDate: Date,
        isPaid: Boolean,
        objectDeletionStatus: Boolean,
        objectHistory: [{date:Date, event:String}]

    })
);

module.exports = Invoice;
