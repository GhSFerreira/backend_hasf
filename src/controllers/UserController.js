const User = require('../models/User');

module.exports = {
    /* --- Create user at database ----*/
    async store(req,res){
        if (!req.body) {
            return res.json({code: 422, msg: 'create user -> params is missing'});
        }

        try {
            let user = await User.create(req.body);
            return res.json(user);
        } catch (err) {
            return res.json(err);
        }

    },

    /* ---- Delete user from DB ----*/
    async delete(req,res){
        const {_id} = req.body;

        if (!_id) {
            return res.status(422).json({msg: 'delete user -> params is missing'});
        }

        try {
            let user = await User.deleteOne({_id});

            if (!user.n) {
                return res.status(422).json(user);
            }else{
                return res.json(user);
            }

        } catch (err) {
            return res.json(err);
        }
    },

    //TODO: Update user at DB
    async update(req,res){
        if (!req.body) {
            return res.json({code: 500, msg: 'req.body params is missing at update user'});
        }


    },

    /*  --- show all users at DB --- */
    async index(req,res){
        try {
            let users = await User.find();
            return res.json(users);
        } catch (err) {
            return res.json(err);
        }
    },

    /* ---- Show user by id --- */
    async show(req,res){
        const {_id} = req.body;

        if (!_id) {
            return res.status(400).json({msg: '_id params is missing -> show -> User'});
        }

        try {
            let users = await User.find({_id});

            if (!users.length) {
                return res.status(404).json(users);
            }else{
                return res.json(users);
            }
            
        } catch (err) {
            return res.json(err);
        }
    },

    /* ---- Find user by name ---- */
    async findUserByName(req,res){
        console.log(req.params);
        
        const {name} = req.params;

        if (!name) {
            return res.json({code: 422, msg: 'name params is missing at finUserByName'});
        }

        try {
            let users = await User.find({name});
            return res.json(users);
        } catch (err) {
            return res.json(err);
        }
    },
}