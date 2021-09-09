'use strict';
 
const productionContract = require('./production.js');

module.exports.ProductionContract = productionContract;
module.exports.contracts = [productionContract];