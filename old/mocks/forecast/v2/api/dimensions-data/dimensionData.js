const restful = require('node-restful');
const mongoose = restful.mongoose;

const contentSchema = mongoose.Schema({
    dimensionDataId: {type: String, required: true},
    content: {type: String, required: true},
});

const dimensionDataSchema = mongoose.Schema({
    dimensionId: {type: String, required: true},
    alias: {type: String, required: true},
    forecastId: {type: String, required: true},
    contents: [contentSchema],
});

module.exports = restful.model('DimensionData', dimensionDataSchema);
