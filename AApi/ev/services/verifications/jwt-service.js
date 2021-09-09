//import section
const jwt = require("jsonwebtoken");
const config = require("../../.config/api-config.js");
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
    isEvAdmin: (req, res, next) => {
        User.findById(req.userId).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            Role.find({
                    _id: { $in: user.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === "ev-admin") {
                            next();
                            return;
                        }
                    }

                    res.status(403).send({ message: "Require ev-admin Role!" });
                    return;
                }
            );
        });
    }


}

module.exports = JWT_SERVICE;