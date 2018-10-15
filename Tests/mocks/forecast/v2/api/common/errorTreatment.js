module.exports = (errors) => {
    if (errors) {
        const fields = Object.keys(errors);
        const error = {};

        fields.forEach(field => {
            const fieldErrorMessage = errors[field];
            const fieldError = {field: fieldErrorMessage.properties.path, value: null, message: fieldErrorMessage.message, text: null, params: {}};
            error[field] = [];
            error[field].push(fieldError);
        });

        return error;
    }
};
