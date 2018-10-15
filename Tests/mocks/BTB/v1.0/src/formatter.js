const validations = require("./validations.js");
const utils = require("./utils.js");

/**
 * GET
 */
exports.formatGet = function(req, res) {
    const url = req.originalUrl.split('?')[0];
    const params = req.originalUrl.split('?')[1];
    let resourceName = url.split('/')[4];
    let resourceId = url.split('/')[5];
    let subResource = url.split('/')[6];
    switch (resourceName) {
        case 'custom-fields':
            if (validations.isGetOnService(req)) {
                for (var i = 0; i < res.locals.data.length; i++) {
                    res.locals.data[i].label = res.locals.data[i].label["en-US"];
                    res.locals.data[i].description = res.locals.data[i].description && res.locals.data[i].description["en-US"];
                    res.locals.data[i].order = (i + 1);
                }
            }
            if (typeof resourceId === 'undefined' || resourceId === '') {
                res.locals.data = {
                    items: utils.getOrderCustomField(res.locals.data),
                    count: res.locals.data.length,
                    page: 0,
                    pageSize: 500
                };
            } else {
                res.locals.data.order = utils.getOrderCustomField(res.locals.data.id);
            }
            break;
    };
};

/**
 * POST
 */
exports.formatPost = function(req, res) {
    let resourceName = req.originalUrl.split('/')[4];
    switch (resourceName) {
        case 'custom-fields':
            res.locals.data = { id: res.locals.data.id };
            break;
    }
};

/**
 * PUT
 */
exports.formatPut = function(req, res) {
    let resourceName = req.originalUrl.split('/')[4];
    switch (resourceName) {
        case 'custom-fields':
            switch (res.statusCode) {
                case 200:
                    res.locals.data.order = utils.getOrderCustomField(res.locals.data.id);
                    res.locals.data.name = utils.getNameOfCustomField(res.locals.data.id);
                    break;
            }
            break;
    }

}

/**
 * DELETE
 */
exports.formatDelete = function(req, res) {
    let resourceName = req.originalUrl.split('/')[4];
    switch (resourceName) {
        case 'custom-fields':
            res.locals.data = undefined;
            break;
        default:
            res.locals.data = undefined;
    }
}