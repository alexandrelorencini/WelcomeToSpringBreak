const DimensionData = require('./dimensionData');
const sendErrorsOrNext = require('../common/errorTreatment');

DimensionData.after('get', sendErrorsOrNext);

const getDimensionDataByForecast = (req, res) => {
    DimensionData.aggregate([{
        $project: {dimensionId: 1, alias: 1, forecastId: 1, contents: 1}
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
        } else {
            !req.params.id ? res.status(404).json({}) : res.json(result.filter((dimensionData) => dimensionData.forecastId === req.params.id));
        }
    });
}

const saveDimensionData = (req, res) => {
    if (!req.params.id) {
        res.status(404).json({});
    } else {
        let dimensionData = new DimensionData(req.body);
        dimensionData.forecastId = req.params.id;

        dimensionData.save().then(function(err) {
            err && console.error(err);
            res.status(201).send({id: dimensionData._id});
        });
    }
}

module.exports = {getDimensionDataByForecast, saveDimensionData};
