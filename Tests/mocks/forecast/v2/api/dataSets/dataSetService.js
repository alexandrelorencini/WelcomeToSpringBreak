const {DataSet} = require('./dataSets');

DataSet.methods(['get', 'post']);

const getDataSet = (req, res) => {
    DataSet.aggregate([
        {
            $project: {
                name: 1, description: 1, _id: 0, id: '$_id',
                'fields': {
                    $map: {
                        input: '$fields',
                        as: 'field',
                        in: {
                            'id': '$$field._id',
                            'name': '$$field.name',
                            'type': '$$field.type'
                        }
                    }
                }
            }
        }
    ], (error, result) => {
        if (error) {
            res.status(500).json({errors: [error]});
        } else if (!req.params.id){
            res.json({items: result, count: result.length, page: 0, pageSize: result.length});
        } else {
            res.json(result.find((dataSet) => dataSet.id.toString() === req.params.id) || []);
        }
    });
};

DataSet.after('get', getDataSet);

module.exports = DataSet;
