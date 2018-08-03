let program = require('commander');
let port = 3000;
const validations = require("./validations.js");
const formatter = require("./formatter.js");
const processor = require("./processor.js");

//MENU
program
    .version('1.0.0')
    .option('-p, --port <n>', "Mock's port. Default value is 3000. Value must be greater than 3000. Example: 'npm run start -- -p 3001' or 'node server.js -p 3001'", parseInt)
    .parse(process.argv);

if (program.port && !isNaN(program.port) && program.port > 3000) {
    port = program.port;
}

//INSTANCE
const jsonServer = require('json-server');
const server = jsonServer.create();
let middlewares = jsonServer.defaults();
server.use(middlewares);
let router = jsonServer.router('./db/db.json');

//CUSTOM REQUEST (Proxy)
server.use(jsonServer.rewriter({
    '/api/v1/business-template-builder/*': '/$1'
}))

//ENTRYPOINT
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    let process;
    switch (req.method) {
        case 'GET':
            process = processor.processGet(req, res);
            switch (process.code) {
                case 200:
                    next();
                    break;
                default:
                    res.status(process.code).send(process.message);
            }
            break;
        case 'POST':
            process = processor.processPost(req);
            switch (process.code) {
                case 200:
                    next();
                    break;
                case 201:
                    next();
                    break;
                default:
                    res.status(process.code).send(process.message);
            }
            break;
        case 'PUT':
            process = processor.processPut(req);
            switch (process.code) {
                case 200:
                    next();
                    break;
                default:
                    res.status(process.code).send(process.message);
            }
            break;
        case 'DELETE':
            process = processor.processDelete(req);
            switch (process.code) {
                case 200:
                    next();
                    break;
                default:
                    res.status(process.code).send(process.message);
            }
            break;
    }
})

//OUTPUT REDIRECT
router.render = (req, res) => {
    switch (req.method) {
        case 'GET':
            switch (res.statusCode) {
                case 200:
                    formatter.formatGet(req, res);
                    res.jsonp(res.locals.data);
                    break;
                default:
                    res.jsonp(undefined);
                    break;
            }
            break;
        case 'POST':
            switch (res.statusCode) {
                case 201:
                    formatter.formatPost(req, res);
                    res.jsonp(res.locals.data);
                    break;
                case 422:
                    formatter.formatPost(req, res);
                    res.jsonp(res.locals.data);
                    break;
                default:
                    res.jsonp(undefined);
                    break;
            }
            break;
        case 'PUT':
            switch (res.statusCode) {
                case 200:
                    formatter.formatPut(req, res);
                    res.jsonp(res.locals.data);
                    break;
                default:
                    res.jsonp(undefined);
                    break;
            }
            break;
        case 'DELETE':
            switch (res.statusCode) {
                case 200:
                    formatter.formatDelete(req, res);
                    res.jsonp(res.locals.data);
                    break;
                default:
                    res.jsonp(undefined);
                    break;
            }
            break;
    }
}

//DEFAULT
server.use(router)

server.listen(port, () => {
    console.log('JSON Server is running on port ' + port)
})
