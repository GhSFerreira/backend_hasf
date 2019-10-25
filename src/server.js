const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tasks = require('./config/tasks');

dotenv.config();

const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://hasf:gsagml20@hasf-gofom.mongodb.net/backend?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}); 

app.use(express.json());
app.use(routes); 

app.listen(process.env.SERVER_PORT)