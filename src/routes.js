const express = require('express');
const routes = express.Router();

//Loggin
const logginDateTime = require('./config/logginMethods').dateAndTimeLoggin;

//Controllers
const SessionControllers = require('./controllers/SessionController');
const UserControllers = require('./controllers/UserController');
const BoletoControllers = require('./controllers/BoletoController');
const SystemControllers = require('./controllers/SystemController');

//Email
const email = require('./config/email');

/* ---------- GET Route Page API ----- */
routes.get('/',  (req,res) => res.send('Backend Hasf'));

/* ---------- Session ------------- */
routes.get('/sessions', SessionControllers.show);


/* -------- User routes -------------*/
routes.post('/user/create', UserControllers.store);
routes.delete('/user/delete', UserControllers.delete);
routes.put('/user', UserControllers.update);
routes.get('/user', UserControllers.index);
routes.get('/user/info', UserControllers.show);
routes.get('/user/find', UserControllers.findUser);


/* --------  Boleto routes  ---------*/
routes.get('/boleto', BoletoControllers.index);
routes.delete('/boleto', BoletoControllers.delete);
routes.get('/boleto/delayedboleto', BoletoControllers.indexDelayedBoleto)
routes.get('/boleto/byuserid', BoletoControllers.index_byUserId);
routes.put('/boleto/update', BoletoControllers.update_status);
routes.get('/boleto/info/:boletoid', BoletoControllers.show);
routes.get('/boleto/latest-by-userid/:user_id', BoletoControllers.showLatestById);
routes.post('/boleto/makecustomer', async (req,res) => {
    let ret = await BoletoControllers.makeCustomer(req.body);

    return res.json({ret});
});
routes.post('/boleto/postback_url', async (req,res) => {    
    console.log(logginDateTime() + ' => POSTBACK_URL received. req.body.status -> ' + req.body.current_status);

    if(req.body.current_status == 'processing'){
        return res.send('OK');
    }

    try {

        if (req.body.current_status == 'waiting_payment') {
            const rtn = await BoletoControllers.store(req,res);

            if (!rtn.code) {
                console.log(`--------- START Boleto Created ---------`);
                console.log(rtn);
                
                await email.mailNewBoleto(req,res);
    
                console.log(`--------- END Boleto Created ---------`);
                
            }else{
                console.log(logginDateTime() + ' ERROR: boleto created => boleto/postback_url => ' + rtn);
                return res.status(500).json(rtn);
            }

        }else if (req.body.current_status == 'paid') {

            const boletoPaid = await BoletoControllers.update_paid(req.body);
            console.log(logginDateTime() + ' boleto paid => boleto/postback_url => ' + boletoPaid);

            return res.json(boletoPaid);
            
        } else if (req.body.current_status == 'refused' || req.body.current_status == 'pending_refund' || req.body.current_status == 'refunded') {
            let boleto = await BoletoControllers.update_status(req.body);
            
            //Loggin
            console.log(logginDateTime() + ' => boleto updated => _id: ' + boleto[0].id + ' , status: ' + boleto[0].status);
            return res.json(boleto);

        }else{
            console.log(logginDateTime() + ' => ERROR:  boleto updated => msg: boleto status wasnt recognized => idTransaction: ' + req.body.id);
            return res.status(404).json({error: {msg: "boleto's status wasnt recognized", url: "/boleto/postback_url"}});
        }
        
    } catch (error) {
        console.log('------ ERROR -> POSTBACK_URL ------');
        console.error(error);

        //Duplicated entry
        if (error.code == 11000) {
            return res.json({msg: 'Boleto has already been registered', id: req.body.id});
        }
        return res.status(500).json(error);
    }

});

/* ----------- System routes ------ */
routes.get('/system', SystemControllers.index);
routes.post('/system', SystemControllers.store);
routes.delete('/system', SystemControllers.delete);
routes.put('/system', SystemControllers.update);
routes.get('/system/info', SystemControllers.show);

/* --------- Session Routes -------- */
routes.post('/session/login', SessionControllers.show);

/* -------------Email------------ */
routes.post('/email', email.sendEmail);

module.exports = routes;