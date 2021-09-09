/**
 * SUMMARY: entry point of the api, it adds all the uses statements,
 * In addition, it identifies the port where the api listens to.
 * Staring the database service and provide the endpoints are initiated 
 * as well in this file
 */

//importing section
const express = require("express");
const cors = require('cors');
const exphbs  = require("express-handlebars");
const bodyParser = require("body-parser");
const config = require("./ev/.config/api-config");
const dbService = require("./ev/services/db-service");
var path = require('path');

const logging = require("./resolvers/logging.js");

//api 
const api = express();

api.engine('handlebars', exphbs());
api.set('view engine', 'handlebars');

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
    logging.addLog("ev_api.js", "--", 43, `Api got started on port ${config.PORT}`);
    
})

api.use(express.static(path.join(__dirname, 'templates')));

//starting the database service
dbService.start();

//initiate the endpoints 
require('./ev/routes')(api);