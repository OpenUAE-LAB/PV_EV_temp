const config = require("../../.config/api-config");
const db = require("../../../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const passwordStrength = require('check-password-strength')


const AUTH_CONTROLLER = {

    signup: (req, res) => {
        const user = new User({
            username: req.body.username,
            email: req.body.email.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 8),
            joiningDate: Date.now()
        });
        
        // check password strength
        if (passwordStrength(req.body.password).id < 2) {
            return res.status(404).send({ message: "password is weak, your password should contain at least 1 uppercase, 1 lowercase, 1 symbol , a number, and should be more than 6 characters" });
        }

        // validate email 
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email)) {
            return res.status(404).send({ message: "invalid email" });
        }

        //validate username
        if (/\s/.test(user.username)) {
            return res.status(404).send({ message: "username shouldn't contain spaces" });
        }

        user.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (req.body.roles) {
                Role.find({
                        name: { $in: req.body.roles }
                    },
                    (err, roles) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        user.roles = roles.map(role => role._id);
                        user.save(err => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            res.send({ message: "User was registered successfully!" });
                        });
                    }
                );
            } else {
                Role.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = [role._id];
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully!" });
                    });
                });
            }
        })
    },
    //log in controller 
    signin: (req, res) => {
        User.findOne({
                email: req.body.email.toLowerCase(), 
            })
            .populate("roles", "-__v")
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.SECRET, {
                    expiresIn: 86400 // 24 hours
                });

                var authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push(user.roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            })
    }

}

module.exports = AUTH_CONTROLLER;