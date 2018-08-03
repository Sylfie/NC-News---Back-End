const { DB_URL } = require('../config/config');
const seedDB = require('./seed');
const mongoose = require('mongoose');
const data = require('./devData/');

mongoose.connect(DB_URL, { useNewUrlParser: true })
    .then(() => seedDB(data))
    .then(() => mongoose.disconnect());