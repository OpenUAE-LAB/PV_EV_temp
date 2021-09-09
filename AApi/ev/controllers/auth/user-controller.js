exports.Accessable = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.EvAdminContent = (req, res) => {
    res.status(200).send("EV admin Content.");
};