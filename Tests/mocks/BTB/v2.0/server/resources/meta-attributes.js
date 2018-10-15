const faker = require('faker');
const uuid = require('uuid/v4');
const utils = require('../utils');

module.exports = (req, res, next) => {
    const { body, method, url } = req;

    if (url.match(/^\/meta-attributes/)) {
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
                body.metaObjectId = req.query.metaObjectId;
                break;
            }
            case 'PUT': {
                const metaAttributes = utils.findResourceById('meta-attributes', resourceId);
                if (metaAttributes !== null) {
                    body.id = metaAttributes.id;
                    body.standard = metaAttributes.standard;
                    body.externalId = metaAttributes.externalId;
                    body.createdAt = metaAttributes.createdAt;
                    body.createdById = metaAttributes.createdById;
                    body.createdByName = metaAttributes.createdByName;
                    body.updatedAt = (new Date()).toISOString();
                    body.updatedById = uuid();
                    body.updatedByName = faker.name.findName();
                    body.metaObjectId = metaAttributes.metaObjectId;
                }
                break;
            }
        }
    }

    next();
};
