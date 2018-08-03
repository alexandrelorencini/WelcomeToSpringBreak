const restful = require('node-restful');
const mongoose = restful.mongoose;

const dataTypeSchema = mongoose.Schema({
    type: {type: String, required: true},
});

module.exports = restful.model('DataType', dataTypeSchema);
