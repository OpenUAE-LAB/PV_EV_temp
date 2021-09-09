/**
 * SUMMARY: EXPORT ALL SERVICES
 */
const activateVehicle   = require('./activateVehicle.js');
const addVehicle        = require('./addVehicle.js');
const deactivateVehicle = require('./deactivateVehicle.js');
const getAllRemovedVehicles = require('./getAllRemovedVehicles.js');
const getAllVehicles      = require("./getAllVehicles.js");
const getAllVehiclesPopulate = require('./getAllVehiclesPopulate.js');
const getVehicle          = require('./getVehicle.js');
const getVehiclePopulate  = require('./getVehiclePopulate.js');
const removeVehicle       = require('./removeVehicle.js');
const updateVehicleDriver = require('./updateVehicleDriver.js');


module.exports = {
    activateVehicle,
    addVehicle,
    deactivateVehicle,
    getAllRemovedVehicles,
    getAllVehicles,
    getAllVehiclesPopulate,
    getVehicle,
    getVehiclePopulate,
    removeVehicle,
    updateVehicleDriver,
};