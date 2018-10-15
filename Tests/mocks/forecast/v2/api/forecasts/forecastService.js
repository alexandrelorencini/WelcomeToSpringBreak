const Forecast = require('./forecasts');
const parseError = require('../common/errorTreatment');
const _ = require('lodash');

Forecast.methods(['get', 'delete', 'put']);

const getForecast = (req, res) => {
    Forecast.aggregate([{
        $project: {_id: 0, id: '$_id', status: 1, description: 1, validity: 1, note: 1}
    }], function(error, result) {
        if (error) {
            res.status(500).json({errors: [error]});
        } else {
            !req.params.id ? res.json({items: result, count: result.length, page: 0, pageSize: result.length}) : res.json(result.find((forecast) => forecast.id.toString() === req.params.id));
        }
    });
};

const searchForecast = (req, res) => {
    Forecast.aggregate([{
        $project: {_id: 0, id: '$_id', status: 1, description: 1, validity: 1, note: 1}
    }], function(error, result) {
        if (error) {
            res.status(500).json({errors: [error]});
        } else {
            if (req.body.description) {
                console.log(result);
                const results = _.filter(result, function(forecast) {
                    return forecast.description.indexOf(req.body.description) > -1;
                });
                res.json({items: results, count: results.length, page: 0, pageSize: result.length});
            } else {
                res.json({items: result, count: result.length, page: 0, pageSize: result.length});
            }

        }
    });
}

const saveForecast = (req, res) => {
    if (!req.params.method) {
        let forecast = new Forecast(req.body);
        forecast.status = 'DRAFT';
        forecast.save().then(() => {
            res.status(201).send({id: forecast._id});
        }).catch((err) => {
            res.status(422).send(parseError(err.errors));
        });
    }
};

const updateStatus = (req, res) => {
    const defaultStatusErrorMsg = status => {
        return {
            status: {
                field: 'status',
                value: null,
                message: `Não foi possível atualizar para o status ${status}`,
                text: null,
                params: {}
            }
        };
    };

    const updateForecast = (status) => {
        return new Promise((resolve) => {
            Forecast.findByIdAndUpdate(req.params.id, {$set: {status: status}}, {new: true}, (newForecast) => {
                return newForecast;
            }).then(result => {
                res.status(200).send();
                resolve(result);
            });
        });
    };

    getForecastById(req.params.id).then(forecast => {
        let status = forecast[0].status;

        switch (req.params.method.toUpperCase()) {
            case 'PUBLISH':
                if (status === 'ABORTED' || status === 'FINISHED' || status === 'PUBLISHING') {
                    res.status(422).send(defaultStatusErrorMsg('PUBLISHED'));
                } else {
                    status = 'PUBLISHED';
                    updateForecast(status);
                }
                break;
            case 'EDIT':
                if (status === 'ABORTED' || status === 'FINISHED' || status === 'DRAFT' || status === 'PUBLISHING') {
                    res.status(422).send(defaultStatusErrorMsg('EDITING'));
                } else {
                    status = 'EDITING';
                    updateForecast(status);
                }
                break;
            case 'ABORT':
                if (status === 'FINISHED' || status === 'PUBLISHING') {
                    res.status(422).send(defaultStatusErrorMsg('ABORTED'));
                } else {
                    status = 'ABORTED';
                    updateForecast(status);
                }
                break;
            case 'FINISH':
                if (status === 'ABORTED' || status === 'EDITING' || status === 'PUBLISHING' || status === 'DRAFT') {
                    res.status(422).send(defaultStatusErrorMsg('FINISHED'));
                } else {
                    status = 'FINISHED';
                    updateForecast(status);
                }
                break;
        }
    });
};

const getForecastById = (forecastId) => {
    return new Promise((resolve) => {
        Forecast.find({'_id': forecastId}, (myForecast) => {
            return myForecast;
        }).then((result) => {
            resolve(result);
        });
    });
};

Forecast.after('get', getForecast);

module.exports = {Forecast, saveForecast, getForecast, updateStatus, searchForecast};
