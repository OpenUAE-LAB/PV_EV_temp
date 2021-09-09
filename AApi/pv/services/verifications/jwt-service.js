//import section
const jwt = require("jsonwebtoken");
const config = require("../../.config/api-config.js");
const ev_config = require("../../.config/server-config");
const db = require("../../../models");
const User = db.user;
const Role = db.role;


const JWT_SERVICE = {

    //verifying Token 
    verifyToken: (req, res, next) => {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        jwt.verify(token, config.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!, Invalid token" });
            }
            req.userId = decoded.id;
            next();
        });
    },

    //TODO: if there is another role need to be added here
    //check if its admin or another role
    isPvAdmin: (req, res, next) => {
        User.findById(req.userId).exec((err, user) => {

            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (user == null){
                res.status(500).send({ message: "Error, the user object is null."});
            }else{
                Role.find({
                    _id: { $in: user.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === "pv-admin") {
                            next();
                            return;
                        }
                    }

                    res.status(403).send({ message: "Require pv-admin Role!" });
                    return;
                }
            );
            }

        });
    }, 

    isAuthorizedServer: (req, res, next) => {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        if(token !=  ev_config.EV_API_TOKEN){
            return res.status(401).send({ message: "Unauthorized!, Invalid token..." });

        }
        next();
    },

    isAuthorizedServerORisPvAdmin: (req, res, next) => {
        console.log("------------------------------------------------------");
        let token = req.headers["x-access-token"];
        console.log(token);
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }else{

            if(token ==  ev_config.EV_API_TOKEN ){
                next();
                return;
            }else{
                let userId = null;
                jwt.verify(token, config.SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(401).send({ message: "Unauthorized!, Invalid token.." });
                    }
                    userId = decoded.id;

                    User.findById(userId).exec((err, user) => {

                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        if (user == null){
                            res.status(500).send({ message: "Error, the user object is null."});
                        }else{
                            Role.find({
                                _id: { $in: user.roles }
                            },
                            (err, roles) => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }
            
                                for (let i = 0; i < roles.length; i++) {
                                    if (roles[i].name === "pv-admin") {
                                        next();
                                        return;
                                    }
                                }
            
                                res.status(403).send({ message: "Require pv-admin Role!" });
                                return;
                            }
                        );
                        }
            
                    });   
                });
         
            }
        }


    }
}

module.exports = JWT_SERVICE;