const db = require("../models");
const Logs = db.log;

exports.addLog = async function (fileName, functionName, lineNumber, message){
    const logs = new Logs({
        timestamp: Date.now(),
        message:`{fileName: ${fileName}, functionName: ${functionName},lineNumber: ${lineNumber}, message: ${message}}`
    });

    return await logs.save(); 
}


