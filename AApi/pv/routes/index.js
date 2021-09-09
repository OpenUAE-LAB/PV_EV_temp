//import section
const config = require("../.config/api-config");
const { authJwt } = require("../services/verifications");
const userController = require("../controllers/auth/user-controller");


module.exports = function(api) {

    //call all authentication routes    

    require('./auth-routes')(api);
    require('./station-routes')(api);

    require('./driverVehicleAssignment-routes')(api);
    require('./pricing-routes')(api);

    require('./csession-routes')(api);
    require('./invoice-routes')(api);
    require('./prodData-routes')(api);
    
    //testing api
    api.get(config.BASE_URL, (req, res) => {
        res.send({ message: "Backend API Base URL" });
    })

    //accessable content
    api.get(config.BASE_URL + "/public", userController.Accessable);

    //authentication required 
    api.get(config.BASE_URL +
        "/pv-content", [authJwt.verifyToken, authJwt.isPvAdmin],
        userController.PvAdminContent
    );
};