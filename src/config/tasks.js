const cronjob = require('cron').CronJob;
const axios = require('axios').default;

/* Method to get funded clients and make boleto for them  */ 
const makeBoletosMonthFinanciado = new cronjob(process.env.MAKE_BOLETO_DATE, async () => {
  
    console.log('------Executed-------');
    

    try {   
        let clients = await axios.get('/client/funded',{ 
            paymentType: 'financiado',
            loanEnded: false,
         });
         console.log(clients);
         
    } catch (err) {
        console.error(err);
    }

}, null ,true);