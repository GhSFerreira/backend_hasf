const System = require('../models/System');

const loggin = require('../config/logginMethods').dateAndTimeLoggin;

module.exports = {

    async store(req,res){
        if (!req.body.factoryName || !req.body.power) {
            return res.status(400).json({error: {msg: 'params is missing', locale: '/system => store'}});
        }
        
        try {
            let system = await System.create(req.body);
            console.log(loggin() + ' system created => ' + system._id);
            
            return res.json(system);

        } catch (error) {
            console.error(loggin() + ' ERROR: store => system => ' + error);
            return res.status(500).json(error);
        }
    },

    async delete(req,res){
        if (!req.body._id) {
            return res.status(400).json({error: {msg: 'params is missing', locale: '/system => delete'}});
        }
        
        let {_id} = req.body;
        try {
            let system = await System.deleteOne({_id});

            if(!system.n){
                console.log(loggin() + ' system delete => ' + _id + ' doesnt exist');
            }else{
                console.log(loggin() + ' system delete => ' + _id); 
            }
            
            return res.json(system);

        } catch (error) {
            console.error(loggin() + ' ERROR: delete => system => ' + error);
            return res.status(500).json(error);
        }
    },

    async update(req,res){
        if (!req.body && !req.headers._id) {
            return res.status(400).json({error: {msg: 'params is missing', locale: '/system => update'}});
        }
        const {_id} = req.headers;
        try {
            let system = await System.updateOne({_id}, req.body);

            console.log(loggin() + ' system updated => ' + _id);
            
            return res.json(system);

        } catch (error) {
            console.error(loggin() + ' ERROR: update => system => ' + error);
            return res.status(500).json(error);
        }
    },

    async index(req,res){
        try {
            let system = await System.find();

            console.log(loggin() + ' system index');
        
            return res.json(system);

        } catch (error) {
            console.error(loggin() + ' ERROR: index => system => ' + error);
            return res.status(500).json(error);
        }
    },
    
    async show(req,res){
        const {_id} = req.query;
        if (!_id) {
            return res.status(400).json({error: {msg: 'params is missing', locale: '/system/info => show'}});
        }

        try {
            let system = await System.findById(_id);

            console.log(loggin() + ' system show => ' + system._id);
            
            return res.json(system);

        } catch (error) {
            console.error(loggin() + ' ERROR: show => system => ' + error);
            return res.status(500).json(error);
        }
    }
    
}