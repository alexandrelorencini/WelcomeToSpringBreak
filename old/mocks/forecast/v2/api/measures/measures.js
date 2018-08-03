const restful = require('node-restful');
const mongoose = restful.mongoose;
const Schema = mongoose.Schema;

const dataTypeSchema = mongoose.Schema({
    type: {type: String}
});

const numberFormatSchema = mongoose.Schema({
    decimalDigits: {type: Number},
    decimalSeparator: {type: String},
    thousandSeparator: {type: String},
    symbol: {type: String},
    symbolPosition: {
        type: String,
        enum: ['LEFT', 'RIGHT']
    }
});

const measureSchema = mongoose.Schema({
    order: {type: Number},
    description: {type: String, required: true},
    editable: {type: Boolean, required: true},
    dataType: {type: Schema.Types.Object, dataTypeSchema, required: true},
    forecastId: {type: String, required: true},
    numberFormat: {type: Schema.Types.Object, numberFormatSchema}
});

module.exports = restful.model('Measure', measureSchema);

