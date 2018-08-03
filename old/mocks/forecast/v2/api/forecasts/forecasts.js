const restful = require('node-restful');
const mongoose = restful.mongoose;
const Schema = mongoose.Schema;

const validitySchema = mongoose.Schema({
    from: {type: String},
    until: {type: String},
});

const forecastSchema = mongoose.Schema({
    description: {type: String, required: true},
    status: {
        type: String,
        enum: ['PUBLISHED', 'PUBLISHING', 'EDITING', 'DRAFT', 'ABORTED', 'FINISHED'],
    },
    note: {type: String},
    validity: {type: Schema.Types.Object, ref: validitySchema, required: true},
});

module.exports = restful.model('Forecast', forecastSchema);
