const faker = require('faker');
const uuid = require('uuid/v4');
const utils = require('../utils.js');

module.exports = (req, res, next) => {
    const { body, method, url } = req;

    if (url.match(/^\/meta-objects/)) {
        const path = url.split('?')[0].split('/');
        const resourceName = path[1];
        const resourceId = path[2];

        switch (req.method) {
            case 'POST': {
                body.id = uuid();
                body.standard = false;
                body.externalId = uuid();
                body.createdAt = (new Date()).toISOString();
                body.createdById = uuid();
                body.createdByName = faker.name.findName();
                body.updatedAt = body.createdAt;
                body.updatedById = body.createdById;
                body.updatedByName = body.createdByName;
                break;
            }
            case 'PUT': {
                const metaObject = utils.findResourceById('meta-objects', resourceId);
                if (metaObject !== null) {
                    body.id = metaObject.id;
                    body.microService = metaObject.microService;
                    body.standard = metaObject.standard;
                    body.externalId = metaObject.externalId;
                    body.createdAt = metaObject.createdAt;
                    body.createdById = metaObject.createdById;
                    body.createdByName = metaObject.createdByName;
                    body.updatedAt = (new Date()).toISOString();
                    body.updatedById = uuid();
                    body.updatedByName = faker.name.findName();
                }
                break;
            }
        }
    }

    next();
};


