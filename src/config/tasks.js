const CronJob = require('cron').CronJob;
const axios = require('axios').default;
const BoletoController = require('../controllers/BoletoController');

/* Method to get funded clients and make boleto for them  */ 
const dateJob = process.env.MAKE_BOLETO_DATE;
const makeBoletosMonthFinanciado = new CronJob(dateJob, () => {
    
    axios.get('http://localhost:4444/user/find?paymentType=financiado&loanEnded=false')
        .then(rs => {
            
            rs.data.forEach(clientData => {
                BoletoController.makeBoleto(clientData);                
            });
        })
        .catch(err => console.error(err))
   
}, null ,true);
