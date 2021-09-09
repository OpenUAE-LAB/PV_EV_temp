/**
 * SUMMARY: starting up the database connection
 * In addition, it initialize the role collections if its empty 
 */

const db = require("../../models");
const db_config = require("../.config/db-config");
const Role = db.role;
const Pricing = db.pricing;
var mongoose = require('mongoose');



const DB_SERVICE = {
    //start the connection service to the DB
    start: function() {
        console.log(`mongodb://${db_config.HOST}:${db_config.PORT}/${db_config.DB}`);
        db.mongoose.connect(`mongodb://${db_config.HOST}:${db_config.PORT}/${db_config.DB}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true})
            .then(() => {
                console.log("Successfully connected to MongoDB.");
                this.initialize();
            })
            .catch(err => {
                console.error("Connection error", err);
                process.exit();
            });

    },
    //initializing the roles tables (once) if there is no records round in the collection
    initialize: function() {
        //Retieve the list of roles to be added
        var roleTobeAdded =db_config.ROLES.slice();
        var listForRoles = [];

        //Get a list of the existing roles in the database
        Role.find({}, {name:1}, function(err, documents) {
            if(err) {
                console.log(err);
            } else {

                //if the Roles table was empty
                if( documents.length === 0){

                    for (i = 0 ; i < roleTobeAdded.length; i ++){
                        listForRoles.push({'name':roleTobeAdded[i]})
                    }
                    Role.insertMany(listForRoles,function(err, documents){
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(`The following roles were inserted ${roleTobeAdded}`); 
                        }
                    });   

                }else{

                    var i = 0;
                    for(i = 0; i < documents.length;  i ++){
                        var index = roleTobeAdded.indexOf(documents[i]['name']);
                        if (index > -1) {
                            roleTobeAdded.splice(index, 1);
                            console.log(`Role [${documents[i]['name']}] was found in the database`);
                        }

                    }     
                    for (i = 0 ; i < roleTobeAdded.length; i ++){
                        listForRoles.push({'name':roleTobeAdded[i]})
                    }

                    if (listForRoles.length === 0 ){
                        console.log(`All the rules exists in the database - ${db_config.ROLES} `); 
                    }else{
                        Role.insertMany(listForRoles,function(err, documents){
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(`The following roles were inserted: ${roleTobeAdded}`); 
                            }
                        });  

                    }
       
                      
                }
            }
        });
    
        let roleslist = db_config.DRIVER_ROLES_LIST.slice();
        console.log(" roleslist ",  roleslist ,  roleslist.length);
        Pricing.find({}, {role:1}, function(err, documents) {  
            
            if(err) {
                console.log(err);
            } else {              
                //if the pricing table was empty
                if( documents.length === 0){
                    var listForRoles = [];
                    for (i = 0 ; i < roleslist.length; i ++){
                        listForRoles.push({'role':roleslist[i], 'priceUnit':0})
                    }

                    Pricing.insertMany(listForRoles,function(err, documents){
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(`The following role names were were inserted to the pricing table: ${roleslist}`); 
                        }
                    }); 

                }else{

                    var i = 0;
                    for(i = 0; i < documents.length;  i ++){
                        var index = roleslist.indexOf(documents[i]['role']);
                        if (index > -1) {
                            roleslist.splice(index, 1);
                            console.log(`Role ${documents[i]['role']} was found in the pricing table`);
                        }

                    }    
                    var listForRoles = []; 
                    for (i = 0 ; i < roleslist.length; i ++){
                        listForRoles.push({'role':roleslist[i]})
                    }

                    if (listForRoles.length === 0 ){
                        console.log(`All the rules exists in the pricing table - ${db_config.DRIVER_ROLES_LIST}`); 
                    }else{
                        Pricing.insertMany(listForRoles,function(err, documents){
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(`The following roles were inserted to pricing [${roleslist}]`); 
                            }
                        });  

                    }
                }
            }
        });     
    }

}


module.exports = DB_SERVICE;