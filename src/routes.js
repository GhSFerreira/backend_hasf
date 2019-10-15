const express = require('express');

const SessionControllers = require('./controllers/SessionController');
const UserControllers = require('./controllers/UserController');
const ClienControllers = require('./controllers/ClientController')
const BoletoControllers = require('./controllers/BoletoController');

const routes = express.Router();

routes.get('/',  (req,res) => res.send('Backend Hasf'))
routes.get('/sessions', SessionControllers.show);

/* -------- User routes -------------*/
routes.post('/user/create', UserControllers.store);
routes.post('/user/delete', UserControllers.delete);
routes.get('/user', UserControllers.index);
routes.get('/user/info', UserControllers.show);
routes.post('/user/find/:name', UserControllers.findUserByName);

/* -------- Client routes -----------*/
routes.get('/client', ClienControllers.index);
routes.get('/client/funded', ClienControllers.index_funded);
routes.get('/client/payment/:paymenttype', ClienControllers.indexByPaymentType);
routes.post('/client/create', ClienControllers.store);
routes.put('/client/update', ClienControllers.update);
routes.delete('/client', ClienControllers.delete);
routes.get('/client/info', ClienControllers.show);

/* --------  Boleto routes  ---------*/
routes.get('/boleto', BoletoControllers.index);
routes.get('/boleto/delayedboleto', BoletoControllers.indexDelayedBoleto)
routes.get('/boleto/byuserid', BoletoControllers.index_byUserId);
routes.post('/boleto/create', BoletoControllers.store);
routes.put('/boleto/update', BoletoControllers.update_status);
routes.get('/boleto/info/:boletoid', BoletoControllers.show);
routes.get('/boleto/latest-by-userid/:user_id', BoletoControllers.showLatestById);


module.exports = routes;