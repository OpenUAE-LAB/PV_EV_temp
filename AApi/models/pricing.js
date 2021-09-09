const mongoose = require("mongoose");

const Pricing = mongoose.model(
    "Pricing",
    new mongoose.Schema({
        role  : String,
        priceUnit : Number,
    })
);

module.exports = Pricing;
