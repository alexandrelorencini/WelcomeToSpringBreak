const restful = require('node-restful');
const mongoose = restful.mongoose;
const Schema = mongoose.Schema;

const field = mongoose.Schema({
    name: {type: String},
    type: {type: String},
});

const dataSetSchema = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    fields: [field]
});

const assossitationSchema = mongoose.Schema({
    description: {type: String},
    relatedFrom: {type: Schema.Types.Object, dataSetSchema},
    relatedTo: {type: Schema.Types.Object, dataSetSchema},
    active: {type: Boolean},
});

const DataSet = restful.model('DataSet', dataSetSchema);
const AssociationSchema = restful.model('AssociationSchema', assossitationSchema);

module.exports = {DataSet, AssociationSchema};
