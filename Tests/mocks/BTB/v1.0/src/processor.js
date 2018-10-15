const uuid_generator = require('uuid/v4');
const validations = require("./validations.js");
const utils = require("./utils.js");

/**
 * GET
 */
exports.processGet = function(req, response) {
    const url = req.originalUrl.split('?')[0];
    const params = req.originalUrl.split('?')[1];
    const isDefault = url.split('/')[1];
    const resourceName = url.split('/')[4];
    if (isDefault === 'db' || isDefault === 'custom-fields') {
        return { code: 200, message: undefined };
    }

    switch (resourceName) {
        //CUSTOM-FIELDS
        case 'custom-fields':
            if (validations.isGetOnService(req)) {
                req.url = `/${resourceName}`;
                return { code: 200, message: undefined };
            }
            if (!validations.validatePath(req)) {
                return { code: 404, message: undefined };
            }
            return { code: 200, message: undefined };
            break;
    }
};

/**
 * POST
 */
exports.processPost = function(req, res) {
    const resourceName = req.originalUrl.split('/')[4];
            req.body.id = uuid_generator();
            req.body.createdAt = Date.now();
            req.body.createdAt = Date.now();
            return true;
    
};

/**
 * PUT
 */
exports.processPut = function(req) {
    const resourceName = req.originalUrl.split('/')[4];
    const resourceId = req.originalUrl.split('/')[5];

    switch (resourceName) {
        //CUSTOM-FIELDS
        case 'custom-fields':
            const default_values = utils.getApiAndResourceOfCustomField(resourceId);
            //NOT FOUND
            if (default_values == null) {
                return { code: 404, message: undefined };
            } else {
                req.body.api = default_values.api;
                req.body.resource = default_values.resource;
            }
            //UNPROCESSABLE ENTITY
            const validation = validations.validateCustomField(req);
            if (validation !== null) {
                return { code: 422, message: validation };
            }
            //IT IS OK
            req.body.id = resourceId;
            req.body.name = utils.getNameOfCustomField(resourceId);
            req.body.type = utils.getTypeOfCustomField(resourceId);
            req.body.order = undefined;
            return { code: 200, message: undefined };
            break;
    }
};

/**
 * DELETE
 */
exports.processDelete = function(req) {
    const resourceName = req.originalUrl.split('/')[4];
    const resourceId = req.originalUrl.split('/')[5];
    switch (resourceName) {
        //CUSTOM-FIELDS
        case 'custom-fields':
            //NOT FOUND
            if (!validations.validatePath(req)) {
                return { code: 404, message: undefined };
            }
            return { code: 200, message: undefined };
            break;
    }
};