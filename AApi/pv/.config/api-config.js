/**
 * SUMMARY: configuration file for the api
 * It contains the main variable to set up the api, you can edit them 
 * based on the requirments
 */

//reading from the evironment file .env
const dotenv = require("dotenv");
dotenv.config();

const API_CONFIG = {

    //base url
    BASE_URL: "/api",
    //port number 
    PORT: process.env.PV_PORT || 8020,
    //auth secret 
    SECRET: process.env.PV_SECRET
}

module.exports = API_CONFIG;

