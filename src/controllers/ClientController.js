const User = require('../models/User');
const Client = require('../models/Client');

module.exports = {
    async index(req, res){
        try {
            let allClients = await Client.find();

            return res.json(allClients);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    /* ---- Return all the clients that is 'financiado' -----*/
    async index_funded(req,res){
        const {paymentType, loanEnded} = req.body;


        if (paymentType != 'financiado') {
            return res.status(400).json({msg: 'paymentType must be financiado'});
        }

        try {
            let fundedClients = await Client.find({paymentType, loanEnded})

            return res.json(fundedClients);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    /* ---- Return all clients by paymentType (avista, financiado) */
    async indexByPaymentType(req,res){
        const paymentType = req.params.paymenttype;

        if(!paymentType) return res.status(400).json({msg: 'paymentType is required'});

        try {
            let clientsPaymentType = await Client.find({paymentType});

            return res.json(clientsPaymentType);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async store(req,res){
        const{pagarmeId,kwh,systemValue,paymentType,loanEnded,payDay} = req.body;
    
        try {
            let clientStore = await Client.create({
                pagarmeId,
                kwh,
                systemValue,
                paymentType,
                loanEnded,
                payDay
            });

            return res.json(clientStore);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async update(req,res){
        if (!req.body && !req.headers._id) {
            return res.status(400).json({msg: 'params is missing at update -> Client'});
        }

        const {_id} = req.headers;
        const clientBody = req.body;

        try {
            let clientupdate = await Client.findByIdAndUpdate(_id, clientBody);
            
            return res.json(clientupdate);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async delete(req,res){       
        const {_id} = req.headers;

        try {
            let deleteClient = await Client.findByIdAndRemove({_id});

            return res.json(deleteClient);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    /* ------- Show informations of a single client ------- */
    async show(req,res){
        const {_id} = req.body;

        if(!_id) return res.status(400).json({msg:'_id must be declared'})

        try {
            let showClient = await Client.findById(_id);

            return res.json(showClient);
        } catch (err) {
            return res.status(400).json(err);
        }
    },
}