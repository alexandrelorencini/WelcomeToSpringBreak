const faker = require('faker');
const uuid = require('uuid/v4');
const utils = require('../utils');

module.exports = (req, res, next) => {
    const { body, method, url } = req;

    if (url.match(/^\/meta-elements/)) {
        const path = url.split('?')[0].split('/');
        const resourceName = path[1];
        const resourceId = path[2];
        const metaScreenId = req.query.metaScreenId;

        switch (req.method) {
            case 'POST': {
                body.id = uuid();
                body.externalId = uuid();
                body.createdAt = (new Date()).toISOString();
                body.createdById = uuid();
                body.createdByName = faker.name.findName();
                body.updatedAt = body.createdAt;
                body.updatedById = body.createdById;
                body.updatedByName = body.createdByName;
                body.metaScreenId = metaScreenId;
                body.order = utils.nextMetaElementOrder();
                break;
            }

            case 'PUT': {
                const metaElements = utils.findResourceById('meta-elements', resourceId);
                if (metaElements !== null) {
                    body.id = metaElements.id;
                    body.order = metaElements.order;
                    body.elementType = metaElements.elementType;
                    body.externalId = metaElements.externalId;
                    body.createdAt = metaElements.createdAt;
                    body.createdById = metaElements.createdById;
                    body.createdByName = metaElements.createdByName;
                    body.updatedAt = (new Date()).toISOString();
                    body.updatedById = uuid();
                    body.updatedByName = faker.name.findName();
                    body.metaScreenId = metaElements.metaScreenId;
                }
                break;
            }
        }
    }

    next();
};
