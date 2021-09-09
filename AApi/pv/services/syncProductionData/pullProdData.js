//import section
const config = require("../../.config/sma-config");
const db = require("../../../models");
const auth_to_SMA = require("./authTo-sma-server");
const axios = require('axios');
const productionData = db.productionData;

// LEDGER RELATED 
const channelName = require('./../../../resolvers/networkConfig.js').channelName ;
const chaincodeName_production = require('./../../../resolvers/networkConfig.js').chaincodeName_production;
const sha256 = require('./../../../resolvers/sha256.js');
const loadNetwork = require("../network-service")
const helper = require("../../../helper.js");

const SessionService = require("./../../../resolvers/sessions");


const pull_prod_data = {

    syncWithSMA: async function () {

        var weather, energyStationName, producedWattUnits, batteryCharging, batteryID, batteryDischarging, batteryLevel, startTimeStamp, endTimeStamp;
        //let token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrM2FXdnQ2LVpqOVM3bWV6QkIzcElnZ2tYRmxGUXRoRXNSYzhoT2ZPY3c0In0.eyJleHAiOjE2MTg0MzU2NzcsImlhdCI6MTYxODQzNTM3NywianRpIjoiNTAzYzEyMjAtNGYwMS00ZjNkLTkyMTktNWYwOWVjZWI4Nzk1IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNtYWFwaXMuZGUvYXV0aC9yZWFsbXMvU01BIiwic3ViIjoiNDhlNjE0MGItOWRhZC00Y2UyLTk3NDItNTc0YjdhNDA1NGM5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hhcmphaF9hcGkiLCJzZXNzaW9uX3N0YXRlIjoiZjMwYjdjMGEtNmJlNS00OTNiLWJiMmUtNzlmOWVjOGNhNDE2IiwiYWNyIjoiMSIsInNjb3BlIjoibW9uaXRvcmluZ0FwaTpyZWFkIiwidWlkIjoiNDEyNTkwIiwiY2xpZW50SWQiOiJzaGFyamFoX2FwaSIsImNsaWVudEhvc3QiOiI1LjEwNy4yNDYuMTc3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2hhcmphaF9hcGlfMjk5NGRlNGFAc21hLmRlIiwiY2xpZW50QWRkcmVzcyI6IjUuMTA3LjI0Ni4xNzcifQ.D7oPDie6g6HX7h3DZALRIyfRHmQpvtH1gY-kfxCVUcS4Ooui5wvOBQjZOG09Uigh1N0DQyWlv1KBCaIWKqXBXj69jUSkjK03PygrQOp3TBtUBNUzCeJlXnaUl8o111GV_rVVAfpF6zFj16oUaALLbmpyDwODdHGV8qyf0828IUtJ8g71_a75BDT4i1adNkRiduTfmjoUD8FwgaClflzzRDbzbikIL5aScQP1VDKPSiQRKYwy4kwsVIpSydbx040BMS48kMjsQO2y35RSxNr_4-kgkqScOBYJOl4eR_b4i58Ap6Cl-OCslTfBQW_-WBEsG2Q5Oq3LYwAZLMGxZe_naA"
        let token = await auth_to_SMA.authenticate_to_SMA();
        console.log(`pull_prod_data:18 - returned from func ${token}`);


        const promiseTemperature = new Promise((resolve, reject) => {
            const instance = axios.create({
                port: 443,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            instance.get(config.TEMP_DATA_LINK)
                .then((response) => {
                    //console.log("[syncWithSMA]: Temperature:", response.data.set[0].ambientTemperature);
                    weather = response.data.set[0].ambientTemperature;

                    resolve([weather, response.data.set[0].time]);
                })
                .catch((error) => {
                    console.log("[syncWithSMA: promiseTemperature] Error connecting to the SMA server", error);
                    reject(config.ERROR_CMD);
                });
        });
        const promisePowerAndBattery = new Promise((resolve, reject) => {
            const instance = axios.create({
                port: 443,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            instance.get(config.BATTERY_DATA_LINK)
                .then((response) => {
                    //console.log("[syncWithSMA]: batteryStateOfCharge:", response.data.set[0].batteryStateOfCharge);
                    resolve([
                        response.data.set[0].batteryCharging,
                        response.data.set[0].batteryDischarging,
                        response.data.set[0].batteryStateOfCharge,
                        response.data.device.deviceId,
                        response.data.plant.name
                    ]);
                })
                .catch((error) => {
                    console.log("[syncWithSMA:promisePowerAndBattery] Error connecting to the SMA server", error);
                    reject(config.ERROR_CMD);
                });
        });

        const promisePVEnergy = new Promise((resolve, reject) => {
            const instance = axios.create({
                port: 443,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            instance.get(config.PV_DATA_LINK)
                .then((response) => {
                    //console.log("[syncWithSMA]: pvGeneration:", response.data.set[0].pvGeneration);
                    resolve(response.data.set[0].pvGeneration);
                })
                .catch((error) => {
                    console.log("[syncWithSMA:promisePowerAndBattery] Error connecting to the SMA server", error);
                    reject(config.ERROR_CMD);
                });
        });

        Promise.all([promiseTemperature, promisePowerAndBattery, promisePVEnergy])
            .then((values) => {
                console.log("values", values);
                weather = values[0][0];
                endTimeStamp = values[0][1];


                batteryCharging = values[1][0];
                batteryDischarging = values[1][1];
                batteryLevel = values[1][2];
                batteryID = values[1][3];
                energyStationName = values[1][4];

                producedWattUnits = values[2];

                endTimeStamp = new Date(endTimeStamp);
                startTimeStamp = new Date(endTimeStamp.getTime() - config.DELAY);
                //console.log("time",endTimeStamp);
            })
            .then(async () => {
                    
                console.log("chaincodeName_production", chaincodeName_production);
                return await loadNetwork(channelName, chaincodeName_production).then(async (contract) => {
                    try {

                        //console.log(`Transaction has been submitted: ${helper.prettyJSONString(prodData.toString())}`)
                        const newProductionData = new productionData({
                            stationName: energyStationName,
                            weather: weather,
                            producedWattUnits: producedWattUnits,
                            batteryID: batteryID,
                            batteryLevel: batteryLevel,
                            startTimeStamp: startTimeStamp,
                            endTimeStamp: endTimeStamp,
                        });


                        let _fullRecord = newProductionData._id.toString()+
                        newProductionData.stationName.toString()+
                        newProductionData.weather.toString()+
                        newProductionData.producedWattUnits.toString()+
                        newProductionData.batteryID.toString()+
                        newProductionData.batteryLevel.toString()+
                        newProductionData.startTimeStamp.toString()+
                        newProductionData.endTimeStamp.toString()

                        let _hash = sha256.getHash(_fullRecord);
                        // Submit the specified transaction.
                        await contract.submitTransaction( 'store', 
                            newProductionData._id, newProductionData.stationName,
                            newProductionData.weather, newProductionData.producedWattUnits ,
                            newProductionData.batteryID, newProductionData.batteryLevel,
                            newProductionData.startTimeStamp, newProductionData.endTimeStamp, _hash);
                        return true;
                    } catch (error) {
                        console.error(`Failed to submit transaction: ${error}`);
                        return false;
                    }
                });

            })
            .then(async (respond) => {
                console.log('respond', respond);

                if (respond == false) {
                    //Report error
                    console.error(`Product wasn't stored in the blockchain, therefore it can't be stored in DB`);
                } else {
                    const newProductionData = new productionData({
                        stationName: energyStationName,
                        weather: weather,
                        producedWattUnits: producedWattUnits,
                        batteryID: batteryID,
                        batteryLevel: batteryLevel,
                        startTimeStamp: startTimeStamp,
                        endTimeStamp: endTimeStamp,
                    });
                    newProductionData.save((err, newProductionData) => {
                        if (err) {
                            console.log("[syncWithSMA: Error - ", err);
                        } else {
                            newProductionData.save(err => {
                                if (err) {
                                    console.log("[syncWithSMA: Error - ", err);
                                } else {
                                    console.log("[syncWithSMA: A production data has been added in DB successfully!");
                                }
                            });
                        }
                    })
                }


            })
            .then(async () => {
                return await SessionService.getAllActiveSessions();
            })
            .then(async (cSessionArray) => {

                var directConsumption;

                if (cSessionArray.length != 0) {
                    // if chargingSessionArray is not empty -> calculate the consumption
                    console.log("[syncWithSMA]: No of activeSessions = ", cSessionArray.length);

                    if (producedWattUnits) {   //Check if PVGeneration is not empty   

                        directConsumption = producedWattUnits - batteryCharging;

                    } else { //  else any consumption is from battery only 
                        console.log("[syncWithSMA]: consumption from battery", batteryDischarging);
                        directConsumption = batteryDischarging;

                    }

                    if (directConsumption < 0) {
                        directConsumption = 0;
                        console.log("[syncWithSMA]: The csession(s) are not consuming any power");
                    } else {
                        console.log("[syncWithSMA]: The csession(s) are consuming: ", directConsumption);


                        var i = 0;
                        var activeSessions = [];
                        for (i = 0; i < cSessionArray.length; i++) {
                            activeSessions.push(cSessionArray[i]._id);
                        }


                        let updateAmount = directConsumption / cSessionArray.length;
                        let query = {
                            _id: {
                                $in: activeSessions
                            }
                        };

                        console.log("[syncWithSMA]: update total: ", directConsumption, " parts: ", updateAmount, " csessions: ", cSessionArray);
                        console.log(query);
                        let sessionUpdated = await SessionService.updateActiveSessions_db(query, updateAmount );
                        console.log('sessionUpdated', sessionUpdated);
                    }

                } else {
                    console.log("[syncWithSMA]: No activeSessions");
                }
            });

    }
}

module.exports = pull_prod_data;
