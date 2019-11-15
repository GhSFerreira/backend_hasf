const CronJob = require('cron').CronJob;
const axios = require('axios').default;
const BoletoController = require('../controllers/BoletoController');

/* Method to get funded clients and make boleto for them  */ 
const makeBoletosMonthFinanciado = new CronJob('0 58 23 10 * *', () => {
    
    axios.get('http://localhost:4444/user/find?paymentType=financiado&loanEnded=false')
        .then(rs => {
            
            rs.data.forEach(clientData => {
                BoletoController.makeBoleto(clientData);                
            });
        })
        .catch(err => console.error(err))
   
}, null ,true);
