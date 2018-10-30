var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var savingSchema = new Schema({
    code: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        maxlength: 255,
        required: false
    },
    person: {
            id: {
            type: String,
            required: false
        }
    }
});

module.exports = mongoose.model('Savings', savingSchema);