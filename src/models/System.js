const mongoose = require('mongoose');

const FactorySchema = new mongoose.Schema({
    factoryName: String,
    power: Number,
    address: String,
    monitor: String
})

module.exports = mongoose.model('Factory', FactorySchema);