const dotenv = require("dotenv");
dotenv.config();

const SERVER_CONFIG = {
    TOKEN: process.env.EV_SECRET,
    EV_PORT: process.env.PV_API_PORT,
    EV_LINK: process.env.EV_LINK,
    EV_API_TOKEN: process.env.EV_SECRET,
}


module.exports =  SERVER_CONFIG;