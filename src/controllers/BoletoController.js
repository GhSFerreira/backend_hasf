const pagarme = require('pagarme');
const Boleto = require('../models/Boleto');

// Loggin
const logginDateTime = require('../config/logginMethods').dateAndTimeLoggin;

module.exports = {

    /* --- Save a boleto at database --- */
    async store(req,res){
        const body = req.body;

        const boletoInfo = {
            user_id: body["transaction[customer][external_id]"],
            boletoId: body.id,
            boletoNumber: body["transaction[boleto_barcode]"],
            boletoUrl: body["transaction[boleto_url]"],
            validDate: body["transaction[boleto_expiration_date]"],
            emissionDate: body["transaction[date_created]"],
            paymentDate: null,
            status: body.current_status,
            boletoValue: body["transaction[amount]"]
        }

        try {
            let boleto = await Boleto.create(boletoInfo);
            
            return boleto;

        } catch (err) {
            throw err;
        }

    },

    /* --- Delete all boletos reference to a user_id --- */
    async deleteAll(user_id){
        if (!user_id) {
            return JSON.stringify({error: {msg: 'user_id is missing', method: 'BoletoController -> deleteAll'}});
        }
        
        try {
            let rtn = await Boleto.deleteMany({user_id});
            
            return JSON.stringify(rtn);

        } catch (error) {
            throw error;
        }

    },

    async delete(req,res){
        if (!req.body._id) {
            return res.status(400).json({error: {msg: '_id params is missing', locale: 'boleto/delete => delete'}});
        }

        try {
            const {_id} = req.body;
            let boleto = await Boleto.deleteOne({_id});

            //Loggin
            console.log(logginDateTime() + ' => deleteBoleto => ' + _id);

            return res.json(boleto);
        } catch (error) {
            console.log(logginDateTime() + '---- ERROR at deleteBoleto -> boleto/delete ----');
            console.error(error);
            return res.status(500).json(error);
        }

    },
    /* --- Update a boleto's status --- */
    async update_status(reqBody){
        const {current_status, id} = reqBody;

        if (!current_status || !id) {
            return JSON.stringify({code: 500, msg:'current_status is missing'});
        }

        try {

            let boleto = await Boleto.find({boletoId: id});
            let updated = await Boleto.updateOne({_id: boleto[0]._id}, {status: current_status});
        
            return boleto;

        } catch (err) {
            throw err;
        }   
    },

    /* Update a boleto as paid boleto - status, paymentDate*/
    async update_paid(updateData){
        const {id, current_status} = updateData;
        const paymentDate = updateData["transaction[date_updated]"];

        try {
            let updated = await Boleto.updateOne({boletoId: id}, {paymentDate, status: current_status});

            return updated;
            
        } catch (error) {
            throw error;
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
        const {user_id} = req.query;

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
    
        pagarme.client.connect({ api_key: process.env.API_KEY_PAGARME })    
        .then(client => client.transactions.create({
            amount: userData.systemValue,
            payment_method: 'boleto',
            postback_url: `${process.env.SERVER_ADDRESS}/boleto/postback_url`,
            soft_descriptor: 'COOERG',
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

    /* ------Make a customer at Pagamer API ----------- */
    makeCustomer(customerData) {
        return new Promise((resolve, reject) => {
          
            if (customerData) {
          
            var typeCustomer;
            var typeDocument;

            if (customerData.document.length == 11) {
              typeCustomer = 'individual';
              typeDocument = 'cpf';
              
            } else {
              typeCustomer = 'corporation';
              typeDocument = 'cnpj';        
            }
          
            pagarme.client.connect({ api_key: process.env.API_KEY_PAGARME })
            .then(client => client.customers.create({
              external_id: `${customerData._id}`,
              name: `${customerData.name}`,
              type:  `${typeCustomer}`,
              country: 'br',
              email: `${customerData.email}`,
              documents: [
                {
                  type: `${typeDocument}`,
                  number: `${customerData.document}`
                }
              ],
              phone_numbers: [`+55${customerData.phone}`]
            }))
            .then(customer => {
                resolve(customer);
            })
            .catch(err => {
                reject(err);
            });
    
          }else{
            reject(new Error('method makeCustomer -> customerData is missing some data'));
          }
        })
    },

}