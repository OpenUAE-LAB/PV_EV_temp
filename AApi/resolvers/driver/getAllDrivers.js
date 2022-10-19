const db = require("../../models");
const User=  db.user;
const Role=  db.role;

const getAllDrivers = async() =>{

    const evDriverNames = ['ev-driver', 'ext-driver'];
    const pipeline =    [
        { "$unwind": "$roles" },
        { "$lookup":
           {
             from: "roles",
             localField: 'roles',
             foreignField: '_id',
             as: 'roleDetails'
           }
         },
         {
            "$match": {
                'roleDetails.name':{
                    "$in":evDriverNames
                }
            }
         },
         {'$project':{ username: 1, email: 1, active:1, roleDetails:1 }
        }
    ]

    return await User.aggregate(pipeline)
    .then(documents => {
        return ([true,documents]);
    })
    .catch(err => {
        return ([false,err]);
    })
}
module.exports = getAllDrivers;

