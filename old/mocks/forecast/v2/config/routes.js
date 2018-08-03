const express = require('express');

module.exports = (server) => {
    const router = express.Router();
    server.use('/api/v2/forecast', router);

    const dataSetService = require('../api/dataSets/dataSetService');
    dataSetService.register(router, '/data-sets');

    const measureService = require('../api/measures/measureServices');
    router.route('/forecasts/:id/measures').get(measureService.getMeasuresByForecast);
    router.route('/forecasts/:id/measures').post(measureService.saveMeasure);
    router.route('/forecasts/:id/measures/:measureId').get(measureService.getMeasuresById);
    router.route('/forecasts/:id/measures/change-order').post(measureService.updateOrderOfMyMeasures);
    measureService.Measure.register(router, '/forecasts/:id/measures');

    const {Forecast} = require('../api/forecasts/forecastService');
    Forecast.register(router, '/forecasts');

    const {searchForecast} = require('../api/forecasts/forecastService');
    router.route('/forecasts/search').post(searchForecast);

    const {saveForecast} = require('../api/forecasts/forecastService');
    const {updateStatus} = require('../api/forecasts/forecastService');
    router.route('/forecasts/:id/:method').put(updateStatus);
    router.route('/forecasts').post(saveForecast);

    const {getAssociationByDataSet} = require('../api/dataSets/associationService.js');
    router.route('/data-sets/:id/associations').get(getAssociationByDataSet);

    const {AssociationSchema} = require('../api/dataSets/associationService');
    AssociationSchema.register(router, '/associations');

    const dimensionService = require('../api/dimensions/dimensionService');
    router.route('/forecasts/:id/dimensions').get(dimensionService.getDimensionsByForecast);
    router.route('/forecasts/:id/dimensions').post(dimensionService.saveDimension);
    router.route('/forecasts/:id/dimensions/:dimensionId').get(dimensionService.getDimensionById);
    dimensionService.Dimension.register(router, '/forecasts/:id/dimensions');

    const treeHateoasService = require('../api/tree-hateoas/treeHateoas');
    router.route('/forecasts/:id/tree-hateoas/:node').get(treeHateoasService.getTreeNode);
    router.route('/forecasts/:id/tree-hateoas').get(treeHateoasService.getTreeNode);

    const dimensioDataService = require('../api/dimensions-data/dimensionDataService');
    router.route('/forecasts/:id/dimensions-data').get(dimensioDataService.getDimensionDataByForecast);
    router.route('/forecasts/:id/dimensions-data').post(dimensioDataService.saveDimensionData);

    const Content = require('../api/contents/contentService');
    Content.register(router, '/forecasts/:id/contents');

    const DataType = require('../api/data-types/dataTypeService');
    DataType.register(router, '/data-types');
};
