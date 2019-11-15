const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tasks = require('./config/tasks');
const cors = require('cors');

dotenv.config();

const routes = require('./routes');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //used for /boleto/postback_url
app.use(routes); 

app.listen(process.env.PORT || 4444)