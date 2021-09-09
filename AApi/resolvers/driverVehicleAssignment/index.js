

const addDVA = require('./addDVA.js')

const getDVAbyDriverID = require('./getDVAbyDriverID.js');
const getDVAbyDriverIDPopulate   = require('./getDVAbyDriverIDPopulate.js');

const getAllDVA= require('./getAllDVA.js');
const getAllDVApopulate= require('./getAllDVApopulate.js');

const getDVAbyVehicleID = require('./getDVAbyVehicleID.js');
const getDVAbyVehicleIDPopulate = require('./getDVAbyVehicleIDPopulate.js');

const removeDVA = require("./removeDVA.js")

module.exports = {
    addDVA,

    getAllDVA,
    getAllDVApopulate,

    getDVAbyDriverID, 
    getDVAbyDriverIDPopulate, 

    getDVAbyVehicleID, 
    getDVAbyVehicleIDPopulate,
    removeDVA,

}