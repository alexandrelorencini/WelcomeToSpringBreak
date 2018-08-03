const Dimension = require('./dimensions');
const parseError = require('../common/errorTreatment');

Dimension.methods(['delete', 'put']);

Dimension.updateOptions({new: true, runValidators: true})

const getDimensionsByForecast = (req, res, next) => {
    Dimension.aggregate([{
        $project: {
            _id: 0, id: '$_id', description: 1, dataSetId: 1, order: 1,
            associationId: 1, forecastId: 1, dataSetFieldId: 1,
            associationType: 1, associationId: 1,
        }
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
            next();
        } else {
            !req.params.id ? res.status(404).json({}) : res.json(result.filter((dimension) => dimension.forecastId.toString() === req.params.id));
        }
    });
};

const getDimensionById = (req, res) => {
    Dimension.aggregate([{
        $project: {
            _id: 0, id: '$_id', order: 1, description: 1, dataSetId: 1,
            associationId: 1, forecastId: 1, dataSetFieldId: 1,
            associationType: 1, associationId: 1,
        }
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
        } else {
            let dimension = result.find((dimension) => dimension.id.toString() === req.params.dimensionId);

            !req.params.id ? res.status(404).json({}) : dimension ? res.json(dimension) : res.status(404).json({});
        }
    });
};

const saveDimension = (req, res) => {
    if (!req.params.id) {
        res.status(404).json({});
    } else {
        let dimension = new Dimension(req.body);
        dimension.forecastId = req.params.id;
        getForecastDimensionOrders(dimension.forecastId).then((response) => {
            response ? dimension.order = response.order+1 : dimension.order = 0;
            dimension.save().then((err) => {
                err && console.error(err);
                res.status(201).send({id: dimension._id});
            }).catch((err) => {
                res.status(422).send(parseError(err.errors));
            });
        });
    }
};

const getForecastDimensionOrders = (forecastId) => {
    return new Promise((resolve) => {
        Dimension.find({'forecastId': forecastId}, {_id: 0, order: 1}, (myDimensions) => {
            return myDimensions;
        }).sort('order').then((result) => {
            resolve(result.pop());
        });
    });
};

Dimension.after('get', getDimensionsByForecast);

module.exports = {getDimensionsByForecast, saveDimension, getDimensionById, Dimension};
