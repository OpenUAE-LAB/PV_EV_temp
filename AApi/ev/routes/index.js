//import section
const config = require("../.config/api-config");
const { authJwt } = require("../services/verifications");
const userController = require("../controllers/auth/user-controller");


module.exports = function(api) {

    //call all authentication routes    
   
    require('./vehicle-routes')(api);
    require('./driverVehicleAssignment-routes')(api);
    require('./auth-routes')(api); 
    require('./driver-routes')(api);
    require('./csession-routes')(api);    
    require('./invoice-routes')(api);
    require('./station-routes')(api);

    //testing api
    api.get(config.BASE_URL, (req, res) => {
        res.send({ message: "Backend API Base URL" });
    })

    //accessable content
    api.get(config.BASE_URL + "/public", userController.Accessable);

    //authentication required 
    api.get(config.BASE_URL +
        "/ev-content", [authJwt.verifyToken, authJwt.isEvAdmin],
        userController.EvAdminContent
    );
};