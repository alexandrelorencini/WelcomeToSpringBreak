const Measure = require('./measures');
const parseError = require('../common/errorTreatment');

Measure.methods(['delete', 'put']);

Measure.updateOptions({new: true, runValidators: true});

const getMeasuresByForecast = (req, res) => {
    Measure.aggregate([{
        $project: {_id: 0, id: '$_id', order: 1, description: 1, editable: 1, dataType: 1, forecastId: 1, numberFormat: 1}
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
        } else {
            !req.params.id ? res.status(404).json({}) : res.json(result.filter((measure) => measure.forecastId.toString() === req.params.id));
        }
    });
};

const getMeasuresById = (req, res) => {
    Measure.aggregate([{
        $project: {_id: 0, id: '$_id', order: 1, description: 1, editable: 1, dataType: 1, forecastId: 1, numberFormat: 1}
    }], function(error, result) {
        if (error) {
            res.status(404).json({});
        } else {
            let measure = result.find((measure) => measure.id.toString() === req.params.measureId);

            !req.params.id ? res.status(404).json({}) : measure ? res.json(measure) : res.status(404).json({});
        }
    });
};

const saveMeasure = (req, res) => {
    if (!req.params.id) {
        res.status(404).json({});
    } else {
        let measure = new Measure(req.body);
        measure.forecastId = req.params.id;
        getForecastMeasureOrders(measure.forecastId).then((response) => {
            response ? measure.order = response.order+1 : measure.order = 0;
            measure.save().then((err) => {
                err && console.error(err);
                res.status(201).send({id: measure._id});
            }).catch((err) => {
                res.status(422).send(parseError(err.errors));
            });
        });
    }
};

const getForecastMeasureOrders = (forecastId) => {
    return new Promise((resolve) => {
        Measure.find({'forecastId': forecastId}, {_id: 0, order: 1}, (myMeasures) => {
            return myMeasures;
        }).sort('order').then((result) => {
            resolve(result.pop());
        });
    });
};

const updateOrderOfMyMeasures = (req, res) => {
    req.body.forEach(measure => {
        new Promise((resolve) => {
            Measure.findByIdAndUpdate(measure.id, {$set: {order: measure.order}}, {new: true}, (newMeasure) => {
                return newMeasure;
            }).then(result => {
                res.status(200).send();
                resolve(result);
            });
        });
    });
};

Measure.after('get', getMeasuresByForecast);

module.exports = {getMeasuresByForecast, saveMeasure, getMeasuresById, updateOrderOfMyMeasures, Measure};
