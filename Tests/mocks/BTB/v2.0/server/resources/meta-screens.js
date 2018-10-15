const faker = require('faker');
const uuid = require('uuid/v4');
const utils = require('../utils.js');

module.exports = (req, res, next) => {
    const { body, method, url } = req;

    if (url.match(/^\/meta-screens/)) {
        const path = url.split('?')[0].split('/');
        const resourceName = path[1];
        const resourceId = path[2];

        switch (req.method) {
            case 'POST': {
                body.id = uuid();
                body.createdAt = (new Date()).toISOString();
                body.createdById = uuid();
                body.createdByName = faker.name.findName();
                body.updatedAt = body.createdAt;
                body.updatedById = body.createdById;
                body.updatedByName = body.createdByName;
                break;
            }
            case 'PUT': {
                const metaScreen = utils.findResourceById('meta-screens', resourceId);
                if (metaScreen !== null) {
                    body.id = metaScreen.id;
                    body.internalName = metaScreen.internalName;
                    body.moduleIdentifier = metaScreen.moduleIdentifier;
                    body.createdAt = metaScreen.createdAt;
                    body.createdById = metaScreen.createdById;
                    body.createdByName = metaScreen.createdByName;
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
