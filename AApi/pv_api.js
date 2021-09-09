/**
 * SUMMARY: entry point of the api, it adds all the uses statements,
 * In addition, it identifies the port where the api listens to.
 * Staring the database service and provide the endpoints are initiated 
 * as well in this file
 */

//importing section
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const config = require("./pv/.config/api-config.js");
const smaConfig = require("./pv/.config/sma-config.js");


const dbService = require("./pv/services/db-service.js");
const prodData_Service = require("./pv/services/syncProductionData/pullProdData.js");
const syncData_Service = require("./pv/services/syncProductionData");

const logging = require("./resolvers/logging.js");

//api 
const api = express();


//parsing requests of content-type -application/json
api.use(bodyParser.json());

//parsing requests of content-type application/x-www-urlencoded
api.use(bodyParser.urlencoded({ extended: true }));

//request header

api.use(cors({
    allowedHeaders: ["x-access-token", "Content-Type"], // you can change the headers
    exposedHeaders: ["x-access-token"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })  );


//running the api on a specific port
api.listen(config.PORT, () => {
    console.log(`Api is running on port ${config.PORT}`)
    logging.addLog("pv_api.js", "--", 46, `Api got started on port ${config.PORT}`);
})

api.use('/public', express.static('publicData')); 

//starting the database service
dbService.start();

//initiate the calls to SMA server
setInterval(syncData_Service.pullProdData.syncWithSMA,smaConfig.DELAY);
syncData_Service.pullProdData.syncWithSMA();
//addSession_toChain(0,0,0,3);
//initiate the endpoints 
require('./pv/routes')(api);