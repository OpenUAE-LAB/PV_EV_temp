const db = require("../../../models");
const User = db.user;
const db_config = require("../../.config/db-config");
const ROLES = db_config.ROLES;

const SIGN_UP_VERIFICATION = {

    //checking any duplication in email and username
    checkDuplicateUsernameOrEmail: (req, res, next) => {
        // Username
        User.findOne({
            username: req.body.username
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            //TODO: username is flexible
            // if (user) {
            //     res.status(400).send({ message: "Failed! Username is already in use!" });
            //     return;
            // }

            // Email
            User.findOne({
                email: req.body.email
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (user) {
                    res.status(400).send({ message: "Failed! Email is already in use!" });
                    return;
                }

                next();
            });
        });
    },
    // check if the role existed in the collection
    checkRolesExisted: (req, res, next) => {
        if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if (!ROLES.includes(req.body.roles[i])) {
                    res.status(400).send({
                        message: `Failed! Role ${req.body.roles[i]} does not exist!`
                    });
                    return;
                }
            }
        }

        next();
    }

}

module.exports = SIGN_UP_VERIFICATION;