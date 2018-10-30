var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 80,
        required: true
    }
})

module.exports = mongoose.model('Person', personSchema);