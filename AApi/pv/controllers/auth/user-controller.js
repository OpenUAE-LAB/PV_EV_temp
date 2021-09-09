exports.Accessable = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.PvAdminContent = (req, res) => {
    res.status(200).send("PV admin Content.");
};