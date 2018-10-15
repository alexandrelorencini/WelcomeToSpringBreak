const restful = require('node-restful');
const mongoose = restful.mongoose;

const measureSchema = mongoose.Schema({
    id: {type: String, required: true},
    value: {type: String, required: true},
});

const contentSchema = mongoose.Schema({
    nodeId: {type: String, required: true},
    measures: [measureSchema],
});

module.exports = restful.model('Content', contentSchema);
