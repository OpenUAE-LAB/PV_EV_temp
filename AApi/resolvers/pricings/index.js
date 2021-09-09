/**
 * SUMMARY: EXPORT ALL SERVICES
 */
const getPricingsByRole   = require('./getPricingsByRole.js');
const getAllPricings      = require('./getAllPricings.js');
const updatePricing      = require('./updatePricing.js');

module.exports = {
    getPricingsByRole,
    getAllPricings,
    updatePricing,
}