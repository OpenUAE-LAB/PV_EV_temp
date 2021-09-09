const db = require("../../models");
const User=  db.user;
const Role=  db.role;


const getAllDrivers = async() =>{
    return await Role.find({ name: ['ev-driver', 'ext-driver']},
        (err, roles) => {
            if (err) {
                console.log("[getAllDrivers]: Err: ", err);
                return ([false,err]);
            };
        
            evDriverID = roles.map(role => role._id);
            user.find(
                { "$or": [
                    { "roles": [evDriverID[0]] },
                    { "roles": [ evDriverID[1]] }
                ]}      
            , { username: 1, email: 1, active:1, roles:1 })
            .populate('roles')
            .then(documents => {
                return ([true,documents]);
            })
            .catch(err => {
                console.log("[getAllDrivers]: Err: ", err);
                return ([false,err]);
            })
        }

    );
}

module.exports = getAllDrivers;



