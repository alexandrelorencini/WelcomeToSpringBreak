const jsonServer = require('json-server');
const dummyjson = require('dummy-json');
const faker = require('faker');
const fs = require('fs');

const server = jsonServer.create();

let middlewares = jsonServer.defaults();
server.use(middlewares);

/* arquivo dummy responsável por gerar dados aleatórios*/
const contents = fs.readFileSync('./dummy/content2.hbs', {encoding: 'utf8'});
const templates = fs.readFileSync('./dummy/template.hbs', {encoding: 'utf8'});
const loadForecast = fs.readFileSync('./dummy/loadForecast.hbs', {encoding: 'utf8', flag : ''});
const loadForecast2 = fs.readFileSync('./dummy/loadForecast2.hbs', {encoding: 'utf8'});
const loadDimensionData = fs.readFileSync('./dummy/loadDimensionData.hbs', {encoding: 'utf8'});
const loadMeasures = fs.readFileSync('./dummy/measures.hbs', {encoding: 'utf8'});

/* aponta para o arquivo que representa a base de dados */
let router = jsonServer.router('db.json');

/* variacoes de rotas que podem ser utilizadas */
server.use(jsonServer.rewriter({
    '/api/v1/forecast/*': '/$1',
    '/:resource/:id/:sub-resource/show': '/:resource/:id/:sub-resource',
    '/:resource/:id/show': '/:resource/:id',
    '/forecasts/:id/structure/:id/tree': '/tree',
    '/forecasts/:id/structure/:id/measures': '/measures',
    '/forecasts/:id/structure/:id/dimensionsData': '/dimensionsData',
    '/forecasts/:id/structure/:id/dimensions': '/dimensions',
    '/forecasts/:id/structure/:id/contents': '/contents',
    '/forecasts/:id/structure/:id/contents/:id': '/contents/:id',
}));

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
    let resourceName = req.originalUrl.split('/')[4];
    let resourceId = req.originalUrl.split('/')[5];
    if (req.method === 'POST' && resourceId === 'search') {
        req.method = 'GET';
        req.url = `/${resourceName}`;
        if (!req.body.generalSearch) {
            req.query = JSON.parse('{"description_like":""}');
        } else {
            req.query = JSON.parse(`{"description_like":"${req.body.generalSearch}"}`);
        }
        req.body = JSON.parse('{}');
    }

    next();
});

server.use((req, res, next) => {
    let resourceName = req.originalUrl.split('/')[4];
    let resourceId = req.originalUrl.split('/')[5];
    let subResourceName = req.originalUrl.split('/')[6];
    let subSubResourceName = req.originalUrl.split('/')[8];
    if (req.method === 'GET' && resourceName === 'forecasts' && subResourceName === 'structure' && subSubResourceName === undefined) {
        req.url = `/${resourceName}/${resourceId}`;
    }

    next();
});

/* rotas customizadas devem ser inseridas aqui */
router.render = (req, res) => {
    let resourceName = req.originalUrl.split('/')[4];
    let resourceId = req.originalUrl.split('/')[5];
    let subResourceName = req.originalUrl.split('/')[6];
    let subResourceId = req.originalUrl.split('/')[7];
    let subSubResourceName = req.originalUrl.split('/')[8];
    console.log('---------------------------------');
    console.log('URL ACESSADA:' + req.originalUrl);
    console.log('RECURSO UTILIZADO: ' + resourceName);
    console.log('RECURSO BUSCADO: ' + resourceId);
    console.log('SUB-RECURSO UTILIZADO: '+ subResourceName);
    console.log('SUB-RECURSO BUSCADO: ' + subResourceId);
    console.log('SUB-SUB-RECURSO UTILIZADO: ' + subSubResourceName);
    if ((req.method === 'POST' || req.method === 'PUT') && resourceName === 'contents') {
        res.set('Content-Type', 'application/json');
        res.send(dummyjson.parse(contents));
    } else if (resourceName === 'templates') {
        res.set('Content-Type', 'application/json');
        res.status(200).send(dummyjson.parse(templates));
    } else if (subSubResourceName === 'measures') {
        res.set('Content-Type', 'application/json');
        res.status(200).send(dummyjson.parse(loadMeasures));
    } else if (resourceName === 'forecasts' && subResourceName === 'structure' && subSubResourceName === 'tree') {
        console.log('---TREE METHOD---');
        res.set('Content-Type', 'application/json');
        res.status(200).send(dummyjson.parse(loadForecast) + dummyjson.parse(loadForecast2));
    } else if (resourceName === 'forecasts' && subResourceName === 'structure' && subSubResourceName === 'dimensionsData') {
        res.set('Content-Type', 'application/json');
        res.status(200).send(dummyjson.parse(loadDimensionData));
    } else if (req.method === 'GET' && resourceName === 'forecasts' && resourceId === undefined) {
        res.send({
            items: res.locals.data,
            count: res.locals.data.length,
            page: 0,
            pageSize: 500
        });
    } else if (req.method === 'GET' && resourceName === 'forecasts' && resourceId === 'search') {
        res.send({
            items: res.locals.data,
            count: res.locals.data.length,
            page: 0,
            pageSize: 500
        });
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (req.body.description === undefined || req.body.description === null || req.body.description === '') &&
                subResourceName === undefined) {
        res.status(422).send({
            description: [{
                field: 'description',
                value: null,
                message: 'This field is required.',
                text: null,
                params: {
                    groups: [],
                    message: 'This field is required.',
                    payload: []
                }
            }]
        });
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (req.body.draft === undefined || req.body.draft === null || req.body.draft === '') &&
                subResourceName === undefined) {
        res.status(422).send({
            draft: [{
                field: 'draft',
                value: null,
                message: 'This field is required.',
                text: null,
                params: {
                    groups: [],
                    message: 'This field is required.',
                    payload: []
                }
            }]
        });
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (req.body.validity) &&
                (req.body.validity.from !== '' || req.body.validity.from !== undefined || req.body.validity.from !== null) &&
                (req.body.validity.until !== '' || req.body.validity.until !== undefined || req.body.validity.until !== null) &&
                (req.body.validity.from > req.body.validity.until) &&
                subResourceName === undefined) {

        res.status(422).send({
            validity: [{
                field: 'from',
                value: null,
                message: 'The start date must be less than the end date.',
                text: null,
                params: {
                    groups: [],
                    message: 'The from date must be lesser than until date.',
                    payload: []
                }
            }]
        });
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (req.body.validity) &&
                (req.body.validity.from === '' || req.body.validity.from === undefined || req.body.validity.from === null) &&
                (req.body.validity.until !== '' || req.body.validity.until !== undefined || req.body.validity.until !== null) &&
                subResourceName === undefined) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0'+dd;
        }
        if (mm < 10) {
            mm = '0'+mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        req.body.validity.from = today;

        res.send(
            res.locals.data
        );
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (!req.body.structure) &&
                (req.body.draft === false) &&
                subResourceName === undefined) {

        res.status(422).send({
            structure: [{
                field: 'structure',
                value: null,
                message: 'It is necessary to inform a structure for a finalized Forecast.',
                text: null,
                params: {
                    groups: [],
                    message: 'It is necessary to inform a structure for a finalized Forecast.',
                    payload: []
                }
            }]
        });
    } else if ((req.method === 'POST' || req.method === 'PUT') &&
                resourceName === 'forecasts' &&
                (!req.body.structure) &&
                (req.body.draft === false) &&
                subResourceName === undefined) {
        console.log('---VALIDATES FINALIZED FORECAST WITHOUT STRUCTURE---');
        res.status(422).send({
            structure: [{
                field: 'structure',
                value: null,
                message: 'It is necessary to inform a structure for a finalized Forecast.',
                text: null,
                params: {
                    groups: [],
                    message: 'It is necessary to inform a structure for a finalized Forecast.',
                    payload: []
                }
            }]
        });
    } else if ((req.method === 'POST') &&
                resourceName === 'forecasts' &&
                (req.body.structure) &&
                subResourceName === undefined) {
        console.log('---CREATES A STRUCTURE---');

        req.body.structure.id = faker.random.uuid();

        res.send(
            res.locals.data
        );
    } else if ((req.method === 'PUT') &&
                resourceName === 'forecasts') {
        console.log('---FORECAST DESCRIPTION VALIDATION---');
        req.body.structure.measures.forEach(function(measure) {
            if (!measure.description) {
                res.status(422).send({
                    measure: [{
                        field: 'description',
                        value: null,
                        message: 'This field is required.',
                        text: null,
                        params: {
                            groups: [],
                            message: 'This field is required.',
                            payload: []
                        }
                    }]
                });
            }
        });
    } else if ((req.method === 'GET') &&
                resourceName === 'forecasts' &&
                subResourceName === 'structure' &&
                subSubResourceName === undefined) {
        console.log('---GETS FORECAST STRUCTURE---');
        res.status(200).send(
            res.locals.data.structure
        );
    } else {
        /* qualquer outra rota tem resposta padrao*/
        res.send(
        //     jsonminify(JSON.parse(res.locals.data))
            res.locals.data
        );
    }
};

server.use(router);
server.listen(3001, function () {
    console.log('Servidor Iniciado');
});
