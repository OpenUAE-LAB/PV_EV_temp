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
    addStation: async(req,res) =>{
        console.log('new', req.body);

        let stationName =req.body.stationName;
        let location    =req.body.location;
        let batteryCapacity=req.body.batteryCapacity;
        let numPVCells     =req.body.numPVCells;
        let capacityPVCells=req.body.capacityPVCells;

        try{
            const newStation = await StationService.addStation(
                stationName, 
                location,
                batteryCapacity,
                numPVCells,
                capacityPVCells    
            );
            res.status(200).send({ message: "A new station has been saved in DB successfully!" , data:newStation});
        }catch(err){
            res.status(500).send({ message: err });
        }          
    },

    updateStation: async(req,res) =>{
        const stationID= req.params.id;
        if (ObjectId.isValid(stationID)){
            try{

                let db_response = await StationService.updateStation(
                    stationID,
                    req.body.stationName,
                    req.body.location,
                    req.body.batteryCapacity,
                    req.body.numPVCells,
                    req.body.capacityPVCells,
                )

                console.log('updateStation', db_response, req.body);
                if(db_response){
                    res.status(200).send({ message: "A station has been edited successfully!" });
                }else{
                    res.status(400).send({ message: 'No object got modified' });
                } 
            }catch(err){
                res.status(500).send({ message: err });
            }
        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }        
    },
    deleteStation: async (req,res) =>{
        const stationID= req.params.id;
        if (ObjectId.isValid(stationID)){
            try{
                if(await StationService.removeStation(stationID)){
                    res.status(200).send({ message: "A station has been deleted successfully!"});
                }else{
                    res.status(400).send({ message: "This ID was not found!" });
                }               
            }catch(err){
                res.status(500).send({ message: err });
            }


        }else{
            //ID requested is not an object ID
            res.status(400).send({ message: "The ID requested is not correct"});           
        }

    }
}
module.exports = VIEW_STATION;