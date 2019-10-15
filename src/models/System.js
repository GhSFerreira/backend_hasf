const mongoose = require('mongoose');

const FactorySchema = new mongoose.Schema({
    factoryName: {
        type: String,
        unique: true,
    },
    power: Number,
    address: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    monitor: String
})

module.exports = mongoose.model('Factory', FactorySchema);