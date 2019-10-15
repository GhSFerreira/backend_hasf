const pagarme = require('pagarme');

const Boleto = require('../models/Boleto');
const User = require('../models/User');

module.exports = {

    /* --- Save a boleto at database --- */
    async store(req,res){
        const {user_id} = req.headers;
        const {boletoId, boletoNumber, boletoUrl, validDate,
            emissionDate, paymentDate, status, boletoValue} = req.body;

        try {
            let boleto = await Boleto.create({
                user_id,
                boletoId,
                boletoNumber, 
                boletoUrl, 
                validDate,
                emissionDate, 
                paymentDate, 
                status, 
                boletoValue
            });
            
            return res.json(boleto);

        } catch (err) {
            return res.status(400).json(err);
        }

        return res.json({boleto});
    },

    /* --- Update a boleto's status --- */
    async update_status(req, res){
        const {status, _id} = req.body;

        if (!status) {
            return res.json({code: 500, msg:'current_status is missing'});
        }

        try {
            let updated = await Boleto.findOneAndUpdate({_id}, {status});
            
            return res.json(updated);

        } catch (err) {
            return res.status(400).json(err);
        }   
    },

    /* --- Show all boletos at DB ---- */
    async index(req,res){
        try {
            let boletos = await Boleto.find();
            return res.json(boletos);
        } catch (err) {
            return res.json(err);
        }
    },

    /* ----- index all boletos of a specific users ----- */
    async index_byUserId(req,res){
        const {user_id} = req.body;

        if (!user_id) {
            return res.json({code: 422, msg: 'user_id params is missing at index_byUserId -> Boleto' })
        }

        try {
            const boletosUser = await Boleto.find({user_id});
            return res.json(boletosUser);

        } catch (err) {
            return res.json(err)
        }
    },
    
    /* ----- Index all boletos that is delayed(atrasado) ----*/
    async indexDelayedBoleto(req,res){
        try {
            let lateBoletos = await Boleto.find({status: 'delayed'});
            return res.json(lateBoletos);
        } catch (err) {
            return res.json(err);
        }
    },
    
    /* ------ Show informations of a specific boleto ----- */
    async show(req,res){
        const boletoId = req.params.boletoid; 
        
        if (!boletoId) {
            return res.status(422).json({msg:'boletoId params is missing at show->BoletoController'})
        }

        try {
            
            let boleto = await Boleto.find({boletoId});
            return res.json(boleto);

        } catch (err) {
            return res.json(err);
        }
    },

    async showLatestById(req,res){
        const {user_id} = req.params;

        if (!user_id) {
            return res.json({code: 422, msg:'user_id params is missing at showLatestById -> BoletoController'});
        }
        try {
            let latestBoleto = await Boleto.find({user_id}).sort({emissionDate: -1});
            

            return res.json(latestBoleto);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    /* ----- Make a boleto at Pagarme API ----*/
    makeBoleto(userData){
    
        /* Start - Set the boleto's expire date according with the user settings  userData.dia_pagamento;*/
        let date = new Date();
        let month = (date.getUTCMonth() + 2);
        let expirate_date;
        /* Verify the month */
        if (month == 13) {
            expirate_date = date.getUTCFullYear() + '-' + 01 + '-' + userData.payDay;
        } else {
            expirate_date = date.getUTCFullYear() + '-' + month + '-' + userData.payDay;      
        }
    
        console.log(expirate_date);
    
        pagarme.client.connect({ api_key: process.env.API_KEY_PAGARME })    
        .then(client => client.transactions.create({
            amount: userData.systemValue,
            payment_method: 'boleto',
            postback_url: `${process.env.SERVER_ADDRESS}/payments/postback_url`,
            soft_descriptor: 'HASF ENERGIA',
            boleto_instruction: 'Boleto referente ao pagamento de sua fatura de energia',
            boleto_expiration_date: expirate_date.toString(),
            capture: true,
            customer: {
                id: userData.pagarmeId
            },
        }))
        .then(transactions => console.log(transactions))
        .catch(err => console.log(err));
    },
}