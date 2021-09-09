var ObjectId = require('mongoose').Types.ObjectId;
const StationService = require("./../../resolvers/stations");


const VIEW_STATION = {


    viewStation: async(req,res) =>{
        try{
            let stationObj = await StationService.getStations();
            res.status(200).json({data:stationObj});
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
}
module.exports = VIEW_STATION;