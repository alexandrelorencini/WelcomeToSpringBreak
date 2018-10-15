const mongoose = require('mongoose');
const url = process.env.MONGOCONNECTION || 'mongodb://localhost/db_forecast';
module.exports = mongoose.connect(url);
