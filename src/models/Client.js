const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pagarmeId: {
        type: Number,
        required:[true, 'pagarmeId is required'],
        unique: true,
    },
    kwh: {
        type: Number,
        required: [true, 'Kwh is required']
    },
    systemValue: {
        type: Number,
        required: [true, 'systemValue is required']
    },
    paymentType: {
        type: String,
        enum: ['avista', 'financiado'],
        required: [true, 'paymentType is required']
    },
    loanEnded: Boolean,
    payDay: {
        type: Number,
        min: 1,
        max: 15,
        required: [true, 'paymentDay is required']
    },
})

module.exports = mongoose.model('Client', ClientSchema);