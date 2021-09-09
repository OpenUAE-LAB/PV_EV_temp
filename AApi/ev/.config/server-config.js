const dotenv = require("dotenv");
dotenv.config();

const SERVER_CONFIG = {
    TOKEN: process.env.PV_SECRET,
    PV_PORT: process.env.PV_API_PORT,
    PV_LINK: process.env.PV_API_LINK,
    PV_API_TOKEN: process.env.PV_API_SECRET,
}


module.exports =  SERVER_CONFIG;
