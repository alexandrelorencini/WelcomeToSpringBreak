const DataType = require('./dataType');

DataType.methods(['get', 'post']);

const getDataType = (req, res) => {
    DataType.aggregate([{
        $project: {_id: 0, id: '$_id', type: 1}
    }], (error, result) => {
        if (error) {
            res.status(500).json({errors: [error]});
        } else if (!req.params.id) {
            res.json({items: result, count: result.length, page: 0, pageSize: result.length})
        } else {
            res.json(result.find((dataType) => dataType.id.toString() === req.params.id));
        }
    });
};

DataType.after('get', getDataType);

module.exports = DataType;
