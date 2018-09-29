const path = require('path');
const commander = require('commander');
const jsonServer = require('json-server');
const render = require('./render');
const metaObjects = require('./resources/meta-objects');
const metaAttributes = require('./resources/meta-attributes');
const metaScreens = require('./resources/meta-screens');
const metaElements = require('./resources/meta-elements');

commander.option('-p, --port <n>', "Mock server's port").parse(process.argv);

const port = commander.port || '3000';
const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db', 'db.json'));
const middlewares = jsonServer.defaults();

const redirects = jsonServer.rewriter({
    "/api/v2/business-template-builder/*": "/$1",
    "/meta-objects/:metaObjectId/meta-attributes": "/meta-attributes?metaObjectId=:metaObjectId",
    "/meta-objects/:metaObjectId/meta-attributes/:metaAttributeId": "/meta-attributes/:metaAttributeId?metaObjectId=:metaObjectId",
    "/meta-screens/:metaScreenId/meta-elements": "/meta-elements?metaScreenId=:metaScreenId",
    "/meta-screens/:metaScreenId/meta-elements/:metaElementId": "/meta-elements/:metaElementId?metaScreenId=:metaScreenId",
});

server.use(redirects);
server.use(jsonServer.bodyParser);
server.use(metaObjects);
server.use(metaAttributes);
server.use(metaScreens);
server.use(metaElements);
server.use(middlewares);
server.use(router);

router.render = render(router.render);

server.listen(port, () => {
    console.log('JSON Server is running on port ' + port);
});
