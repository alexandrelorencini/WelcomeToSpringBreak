const validator = require('validator');

/**
 * VALIDATE PATH
 */
exports.validatePath = function(req) {
    let resourceId = req.originalUrl.split('/')[5];
    if (typeof resourceId === 'undefined' || validator.isUUID(resourceId, 4)) {
        return true;
    }
    return false;
};

/**
 * VALIDATE CUSTOM FIELD
 */
exports.validateCustomField = function(req) {
    let cf = req.body;
    let errors = {};
    let hasErrors = false;

    //VALIDATE LABEL
    if (!cf.label) {
        hasErrors = true;
        errors.label = [{
            field: "label",
            value: null,
            message: "This field is required",
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.notnull.requiredAttribute.message",
                requiredAttribute: "",
                message: "This field is required",
                payload: []
            }
        }]
    }

    //VALIDATE INTERNACIONALIZATION
    if (cf.label && !cf.label['en-US']) {
        hasErrors = true;
        errors.label = [{
            field: "label",
            value: null,
            message: "It is necessary inform translations for this field",
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.notnull.requiredAttribute.message",
                requiredAttribute: "",
                message: "It is necessary inform translations for this field",
                payload: []
            }
        }]
    }

    // VALIDATE API
    if (!cf.api) {
        hasErrors = true;
        errors.api = [{
            field: "api",
            value: null,
            message: "This field is required",
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.notnull.requiredAttribute.message",
                requiredAttribute: "",
                message: "This field is required",
                payload: []
            }
        }]
    }

    //VALIDATE API VALUE
    if (cf.api && cf.api !== 'service') {
        hasErrors = true;
        errors.api = [{
            field: "api",
            value: null,
            message: 'Can not deserialize value from String "' + cf.api + '": value not one of declared names: [service]',
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.element.notPresentOnList.message",
                requiredAttribute: "",
                message: 'Can not deserialize value from String "' + cf.api + '": value not one of declared names: [service]',
                payload: []
            }
        }]
    }

    //VALIDATE RESOURCE
    if (!cf.resource) {
        hasErrors = true;
        errors.resource = [{
            field: "resource",
            value: null,
            message: "This field is required",
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.notnull.requiredAttribute.message",
                requiredAttribute: "",
                message: "This field is required",
                payload: []
            }
        }]
    }

    //VALIDATE RESOURCE VALUE
    if (cf.resource && cf.resource !== 'service') {
        hasErrors = true;
        errors.resource = [{
            field: "resource",
            value: null,
            message: 'Can not deserialize value from String "' + cf.resource + '": value not one of declared names: [service]',
            text: null,
            params: {
                groups: [],
                requiredAttributeMessage: "validation.element.notPresentOnList.message",
                requiredAttribute: "",
                message: 'Can not deserialize value from String "' + cf.resource + '": value not one of declared names: [service]',
                payload: []
            }
        }]
    }

    if (hasErrors) {
        return errors;
    } else {
        return null;
    }
};

/**
 * VALIDATE IF THE REQUEST IS A GET ON THE CUSTOM FIELDS ON SERVICE's RESOURCE OF SERVICE's API
 */
exports.isGetOnService = function(req) {
    if (req.method === 'GET' && req.query.api && req.query.api === 'service' &&
        req.query.resource && req.query.resource === 'service') {
        return true;
    } else {
        return false;
    }
}