const LoggingService = require("./../../resolvers/log");

const VIEW_LOGS = {

    veiwLogs: async(req, res) => {
        try{
            let logsObjects = await LoggingService.viewLogs();
            res.status(200).json({data:logsObjects});
        }catch(err){
            res.status(500).send({ message: err });
        }
    }
}

module.exports = VIEW_LOGS;