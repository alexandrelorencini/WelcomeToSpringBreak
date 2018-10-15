const {AssociationSchema} = require('./dataSets');

AssociationSchema.methods(['post', 'get']);

const getAssociationByDataSet = (req, res) => {
    AssociationSchema.aggregate([{
        $project: {_id: 0, id: '$_id', description: 1, relatedFrom: 1, relatedTo: 1, active: 1}
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
        } else if (!req.params.id) {
            res.status(404).json({});
        } else if (!req.query.associationType || req.query.associationType === 'inner_join') {
            res.json(result.filter((association) => association.relatedFrom.id.toString() === req.params.id));
        } else if (req.query.associationType === 'cross_join') {
            res.json(result);
        }
    });
};

const getAssociation = (req, res) => {
    AssociationSchema.aggregate([{
        $project: {_id: 0, id: '$_id', description: 1, relatedFrom: 1, relatedTo: 1, active: 1}
    }], function(error, result) {
        if (error) {
            res.status(500).json({errors: [error]});
        } else if (!req.params.id) {
            res.json({items: result, count: result.length, page: 0, pageSize: result.length});
        } else {
            res.json(result.find((association) => association.id === req.params.id));
        }
    });
};

AssociationSchema.after('get', getAssociation);

module.exports = {AssociationSchema, getAssociationByDataSet, getAssociation};
