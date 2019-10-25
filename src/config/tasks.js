const CronJob = require('cron').CronJob;
const axios = require('axios').default;
const BoletoController = require('../controllers/BoletoController');

/* Method to get funded clients and make boleto for them  */ 
const makeBoletosMonthFinanciado = new CronJob('0 04 21 15 * *', () => {
    
    axios.get('http://localhost:4444/client/funded?paymenttype=financiado&loanended=false')
        .then(rs => {
            rs.data.forEach(clientData => {
                BoletoController.makeBoleto(clientData);
            });
        })
        .catch(err => console.error(err))
   
}, null ,true);

