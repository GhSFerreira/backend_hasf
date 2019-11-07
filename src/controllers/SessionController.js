const User = require('../models/User');

module.exports = {
    //Get 
    async show(req, res){
        const {document, pwd} = req.body;

        let user = await User.findOne({document, pwd});

        if (!user) {
            return res.sendStatus(404);
        }

        let userInfo = {
            _id: user._id
        };

        return res.json(userInfo);
    },

}