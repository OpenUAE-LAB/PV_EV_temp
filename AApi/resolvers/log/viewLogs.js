const db = require("../../models");
const Log= db.log;


const viewLogs = async() =>{
    const logs = await Log.find();
    return logs;
}

module.exports = viewLogs;