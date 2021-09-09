/**
 * SUMMARY: Initialize models
 */
const db_config = require("../.config/db_config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//{dbConfig, db_shared_Config} 

//init db
const db = {};
db.mongoose = mongoose;


//Common Models
db.user = require('./user');
db.role = require("./role");
db.invoice = require('./invoice');
db.vehicle = require("./vehicle");
db.chargingSession = require('./chargingSession');
db.driverVehicleAssignment = require('./driverVehicleAssignment');
db.log = require('./log');

//Models for PV only
db.station = require("./station");
db.pricing = require("./pricing");
db.sma_token = require("./sma_token");
db.productionData = require("./productionData");

module.exports = db;