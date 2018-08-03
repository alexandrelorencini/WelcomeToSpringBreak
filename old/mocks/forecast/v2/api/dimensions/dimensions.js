const restful = require('node-restful');
const mongoose = restful.mongoose;

const dimensionSchema = mongoose.Schema({
    description: {type: String, required: true},
    dataSetId: {type: String, required: true},
    dataSetFieldId: {type: String},
    order: {type: Number},
    associationId: {type: String},
    associationType: {
        type: String,
        enum: ['CROSS_JOIN', 'INNER_JOIN']
    },
    forecastId: {type: String, required: true}
});

module.exports = restful.model('Dimension', dimensionSchema);
