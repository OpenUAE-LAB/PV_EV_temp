const mongoose = require("mongoose");

const Station = mongoose.model(
    "Station",
    new mongoose.Schema({
        stationName :String,
        location: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
            },
            coordinates: {
              type: [Number],
            }
          },
        batteryCapacity : Number,
        numPVCells:  Number,
        capacityPVCells:Number,
        objectDeletionStatus: Boolean
    })
);

module.exports = Station;
