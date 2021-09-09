/**
 * SUMMARY: configuration file for the database
 * You can edit these variables to match the environment setup you have.
 */
//reading from the evironment file .env
const dotenv = require("dotenv");
dotenv.config();

const DB_CONFIG = {
    //host name
    HOST: process.env.DB_HOST,
    //port number
    PORT: process.env.DB_PORT,
    //db name
    DB: process.env.DB_NAME
 }

module.exports = DB_CONFIG;

