/* --- Date and Time for loggin --- */
const dateAndTime = new Date();

module.exports = {

    dateAndTimeLoggin(){
/*         let date = dateAndTime.getUTCDate() + '/' + dateAndTime.getUTCMonth() + '/' + dateAndTime.getUTCFullYear() + ' ';
        let hour = dateAndTime.getUTCHours() + ':'+ dateAndTime.getUTCMinutes() + ':' + dateAndTime.getUTCSeconds() + ' ';   */
        
        return dateAndTime.toUTCString();
    }
}