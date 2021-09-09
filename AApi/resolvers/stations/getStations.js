const db = require("../../models");
const station = db.station;

const getStations = async() =>{
    const objects = await station.find();
    return objects;
}

module.exports = getStations;




