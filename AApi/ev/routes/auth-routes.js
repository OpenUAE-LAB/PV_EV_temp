/**
 * SUMMARY: 
 * Endpoints for the authentication 
 * Signin ==> check the username and password
 * Signup ==> register a new user to the system
 */

//import section
const { verifySignUp } = require("../services/verifications");
const controller = require("../controllers/auth/auth-controller");
const config = require("../.config/api-config");


module.exports = function(api) {

    //registration
    api.post(
        config.BASE_URL + "/auth/signup", [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    //login
    api.post(config.BASE_URL + "/auth/signin", controller.signin);

};