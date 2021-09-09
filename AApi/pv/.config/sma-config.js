const dotenv = require("dotenv");
dotenv.config();


const SMA_CONFIG = {

    //SMA Auth Link
    AUTH_LINK: "https://auth.smaapis.de/oauth2/token",
    TEMP_DATA_LINK: 'https://smaapis.de/monitoring/v1/devices/6169839/measurements/sets/Sensor/Recent',
    PV_DATA_LINK: "https://smaapis.de/monitoring/v1/devices/6167580/measurements/sets/EnergyAndPowerPv/Recent",
    BATTERY_DATA_LINK: "https://smaapis.de/monitoring/v1/devices/6167581/measurements/sets/EnergyAndPowerBattery/Recent",

    //datalink
    DELAY: 50000,//300s  ~ 5mins

    TOKEN_EXPIRY : 30, //30 days 

    //authParamters:
    AUTH_PARAM:
    {
        "grant_type":"client_credentials",
        "client_id": "sharjah_api",
        "client_secret": "93d099e7-ea47-4e41-9df7-77af5ec23bd4"
    },
    ERROR_CMD : "Error_occured"

}

module.exports = SMA_CONFIG ;


    //https://smaapis.de/monitoring/v1/plants/6167563/location
    //https://smaapis.de/monitoring/v1/plants/6167563/installation
    //https://smaapis.de/monitoring/v1/devices/6167581

    /*{
        "plantId": "6167563",
        "name": "UOS-CCS001",
        "timezone": "Asia/Dubai",
        "currencyCode3": "AED",
        "address": {
            "country": "AE",
            "federalState": "Sharjah",
            "city": "Sharjah",
            "longitude": 55.485110,
            "latitude": 25.292450
        }
    }
    {
        "plantId": "6167563",
        "name": "UOS-CCS001",
        "peakPower": 6000.0,
        "dcPowerInputMax": 7400.0,
        "startUpUtc": "2021-01-25T00:00:00",
        "orientation": {
            "azimuth": 30,
            "collectorSlope": 10
        }
    }
    {
    "plant": {
        "plantId": "6167563",
        "name": "UOS-CCS001",
        "timezone": "Asia/Dubai"
    },
    "details": {
        "deviceId": "6167581",
        "name": "SN 3010466071",
        "timezone": "Asia/Dubai",
        "type": "Battery Inverter",
        "product": "SI6.0H-13",
        "productId": 9475,
        "serial": "3010466071",
        "vendor": "SMA Solar Technology AG",
        "isActive": true,
        "batteryCapacity": 34560.0,
        "ipAddress": "172.25.9.162",
        "firmwareVersion": "03.20.20.R",
        "communicationProtocol": "Speedwire",
        "startUpUtc": "2021-01-25T00:00:00",
        "isResetted": false
    }
}

    */