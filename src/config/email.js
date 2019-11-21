const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const date = new Date();    // Current date and time for logs

/* 
* Transporter settings according to email's host 
*/
let transporter = nodemailer.createTransport({
    name: 'www.hasfenergia.com.br', /* *******DONT'T REMOVE!!*****  Others server need that information to accept the email*/
    host: "mail.hasfenergia.com.br",
    port: 465,
    secure: true,
    auth:{
        user: "no-reply@hasfenergia.com.br",
        pass: "gsagml20"
    },
    tls: {rejectUnauthorized: false }   
});


/* 
*   send an email to users when their boletos is made
*   @this {mailBoletoWaitinPayment}
*   @params {object} userData  - object with some information of the user and boleto
*   @params {string} msgReasonBoleto - a string with the boleto's reason
*   @params {string} template - represents the email template to be sent

*/
module.exports = {
    
    async sendEmail(req,res) {
        if (req.body.mailData && req.body.subject && req.body.template) {
    
            //current date and time
            let datehour = date.getUTCDate()+ '/' + date.getUTCMonth() +'/'+ date.getUTCFullYear()+' '+ date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
        
            try {
                
                let templateStr = await ejs.renderFile(path.join(__dirname,'..', `/views/email/${req.body.template}`), req.body);
    
                let mailOptions = {
                    from: 'Cooerg <no-reply@hasfenergia.com.br>',
                    to: `${req.body.mailData.mail}`,
                    subject: `${req.body.subject}`,
                    html: templateStr
                }
            
                let info = await transporter.sendMail(mailOptions);
    
                console.log(datehour+' -> ' +' Email sent: %s', info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                return res.json(info);
            } catch (error) {
    
                console.error(datehour + ' -> Error: ' + error);
                return res.status(500).json(error);
            }
    
        } else {
            console.log('mailData && subject not defined');
        }
    
    },

    async mailNewBoleto(req,res){

        const mailInfo = {
            body:{ 
                subject: 'Cooerg - Sua fatura de energia já está disponível ',
                template: 'faturaHasf.ejs',
                mailData: {
                    name: req.body["transaction[customer][name]"],
                    mail: req.body["transaction[customer][email]"],
                    boleto_amount: (req.body["transaction[amount]"] / 100),
                    boleto_barcode: req.body["transaction[boleto_barcode]"],
                    boleto_url: req.body["transaction[boleto_url]"]
                }}
        }
        await this.sendEmail(mailInfo, res);
    }
}

