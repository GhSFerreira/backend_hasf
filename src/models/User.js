const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    document: {
        type: String,
        minlength: [11, 'cpf/cnpj is too short'],
        maxlength: [14, 'cpf/cnpj is too big'],
        required: [true, 'document is required'],
        unique: true
    },
    name: {
        type: String,
        maxlength: 45,
        required: [true, 'name is required'],
    },
    birthday: Date,
    email: {
        type: String,
        maxlength: 45,
        required: [true, 'email is required']
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{12}|\d{10}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
      },
    cep: Number,
    pwd: {
          type: String,
          minlength: [6, 'Password must be grather/equal than 6'],
          maxlength: [20, 'Password must be less/equal 20'],
          required: [true, 'Password is required']
    },
    city:{
        type: String,
        maxlength: 45,
        required: [true, 'City is required']        
    },
    street: {
        type: String,
        maxlength: 45,
        required: [true, 'Street is required']        
    },
    homeNumber: {
        type: Number,
        required: [true, 'homeNumber is required']        
    },
    state: {
        type: String,
        maxlength: 30,
        required: [true, 'state is required']        
    },
    pagarmeId: Number,
    kwh: {
        type: Number,
        required: [true, 'Kwh is required']
    },
    systemValue: {
        type: Number,
        required: [true, 'systemValue is required']
    },
    systemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'System',
        required: [true, 'systemId is required']
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
    }

})

module.exports = mongoose.model('User', UserSchema);