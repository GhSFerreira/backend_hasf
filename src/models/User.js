const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    document: {
        type: Number,
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
            return /\+\d{13}/.test(v);
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
    }

})

module.exports = mongoose.model('User', UserSchema);