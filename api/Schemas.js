//mongoose - cria uma classe para comunicar o node x mongodb

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var personSchema = new Schema({
    name: {
        type: String,
        minlength: 10,
        maxlength: 80,
        required: true
    }
})

module.exports = mongoose.model('Person', personSchema)