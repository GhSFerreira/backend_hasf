const User = require('../models/User');
const BoletoControllers = require('./BoletoController');

//Loggin methods
const logginDateAndTime = require('../config/logginMethods').dateAndTimeLoggin;

module.exports = {
    /* --- Create user at database ----*/
    async store(req,res){
        if (!req.body) {
            return res.json({code: 422, msg: 'create user -> params is missing'});
        }

        let user, client;
        try {
            let customer = await BoletoControllers.makeCustomer(req.body);
            
            //Rewrite pagarmeId in req.body with the id received by customer
            req.body.pagarmeId = customer.id;

            user = await User.create(req.body);
            
            console.log('--------- Create a User --------');
            console.log('customer => ' + customer);
            console.log('user => ' + user);
            console.log('--------- End - Create a User --------');
            
            

            return res.json ({customer,user});
        } catch (err) {
            console.log(user);
            
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
                console.log('------- START delete user ---------');
                console.log(logginDateAndTime() + ' => deleteUser => Error: Didnt delete the user '+ _id);
                return res.status(422).json(user);
            }else{

                let boletos = await BoletoControllers.deleteAll(_id);

                if (boletos.error) {
                    console.log(logginDateAndTime() + ' => deleteUser => Error: Didnt delete the all boleto -> user_id: '+ _id);
                    return res.status(404).json(boletos);
                }else{
                    /* ----- Loggin ----- */
                    console.log(logginDateAndTime() + ' => deleteUser => '+ _id);
                    console.log('--------- END delete user ------');
                    
                    return res.json({user, boletos});
                } 
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