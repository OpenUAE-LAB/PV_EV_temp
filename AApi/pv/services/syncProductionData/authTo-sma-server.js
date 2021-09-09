const config = require("../../.config/sma-config");
const db = require("../../../models");
const SMA_Token = db.sma_token;
const https = require('https');

const axios = require('axios');
const qs = require('qs');

const auth_to_SMA = {
    authenticate_to_SMA: async function() {
        var tesingResponse = "(bfr) no token"; 
        return new Promise((resolve, reject) => {
            SMA_Token.find({}, async function(err, documents) {
                console.log("authenticate_to_SMA - line15");
                if(err) {
                    console.log(err);
                    reject(err);
                } else { 
                    console.log("authenticate_to_SMA - line19");

                    //if the table was empty
                    if( documents.length === 0){
                        let token = await get_new_token_signIn();
                        console.log("authenticate_to_SMA - Token from new token function : ",token);
                        resolve(token);


                    }else{//Token is available - refresh it
                        console.log("authenticate_to_SMA - line:30 ");
                        let refreshToken = documents[0].refresh_token;
                        let token = await get_refreshToken(refreshToken);
                        resolve(token);
                    }
                    
                }
            });

          });
    }

}


/*
async function get_refreshToken(refreshToken) {
  
    // create a new promise inside of the async function
    let promise = new Promise((resolve, reject) => {
      
        const instance = axios.create({
            port : 443,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        var data = {...config.AUTH_PARAM};
        data['refresh_token'] = refreshToken;
        instance.post(config.AUTH_LINK, qs.stringify(data))
        .then((response) => {
            console.log(`LINE [98] ${response.data.access_token}`);
            //new_token = response.data.access_token;
            resolve(response.data.access_token);
        })
        .catch((error) => {
            console.log(`Error connecting to the SMA server \n${error}`);  
            reject(config.ERROR_CMD);
        });
    });
    
    // wait for the promise to resolve
    return(await promise);
  }

*/


function get_new_token_signIn(){
    const instance = axios.create({
        port : 443,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    let data = qs.stringify(config.AUTH_PARAM);

    return instance.post(config.AUTH_LINK, data)
    .then((response) => {
        //store the access token in the database with today's date
        console.log("token from new token signIn response ");
        const newToken = new SMA_Token({
            refresh_token: response.data.refresh_token,
            obtainedData: Date.now()

        });

        var res = "testing"; 
        newToken.save((err, newToken) => {
            if (err) {
                console.log(err);
                return err;
            } else {
                newToken.save(err => {
                    if (err) {
                        console.log(err);
                        return err;
                    }else{
                        res = response.data.access_token; 
                        return response.data.access_token;
                    }
                });
            }      
        })  
        
        return response.data.access_token; 

    })
    .catch((error) => {
        console.log("Error connecting to the SMA server");  
        console.log(error);
        return error; 
    });
}


function get_refreshToken(refreshToken){
    const instance = axios.create({
        port : 443,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    var data = {...config.AUTH_PARAM};
    data['refresh_token'] = refreshToken;
    console.log(data);

    return instance.post(config.AUTH_LINK, qs.stringify(data))
    .then((response) => {
        console.log(`[get_refreshToken]  ${response.data.access_token}`);
        //new_token = response.data.access_token;
        return response.data.access_token; 

    })
    .catch((error) => {
        console.log("[get_refreshToken] Error connecting to the SMA server");  
        console.log(error);
        return error; 
    });
}
   



function is_refresh_token_expired(obtainedDate){
    let nowDate = Date.now();
    const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 
    console.log(diffDays + " days");
}
module.exports = auth_to_SMA ;
