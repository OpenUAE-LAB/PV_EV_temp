/**
 * SUMMARY: configuration file for the database
 * You can edit these variables to match the environment setup you have.
 */
//reading from the evironment file .env
const dotenv = require("dotenv");
dotenv.config();

const db_info = require("../../.config/db_config.js")

const DB_CONFIG = {
    //host name
    HOST: db_info.HOST,
    //port number
    PORT: db_info.PORT,
    //db name
    DB: db_info.DB,
 
    //allowed roles
    ROLES: ['ev-admin', 'ev-driver', 'ext-driver'],   
    PV_API_PORT : process.env.PV_API_PORT
}

module.exports = DB_CONFIG;