const mongoose = require('mongoose');

const BoletoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user_id is required']
    },
    boletoId: { //Boleto id at pagarme database
        type: Number,
        required: [true, 'boletId is required'],
        unique: true,
    },   
    boletoNumber: {
        type: String,
        required: [true, 'boletoNumber is required']
    },
    boletoUrl: {
        type: String,
        required: [true, 'boletoUrl is required']
    },
    validDate: {
        type: Date,
        required: [true, 'validDate is required']
    },
    emissionDate: {
        type: Date,
        required: [true, 'emissionDate is required']
    },
    paymentDate: Date,
    status: {
        type: String,
        enum: ['waiting_payment', 'paid', 'delayed'],
        required: [true, 'status is required']
    },
    boletoValue: {
        type: Number,
        required: [true, 'boletoValue is required']
    }

})

module.exports = mongoose.model('Boleto', BoletoSchema);