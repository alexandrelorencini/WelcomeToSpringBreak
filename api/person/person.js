const uuid = require('uuid/v4');

module.exports = (req, res, next) => {
    const { body, method, url } = req;

    if (url.match(/^\/person/)) {
        const path = url.split('?')[0].split('/');

        const resourceName = path[1];
        const resourceId = path[2];
        console.log('0', path[0])
        console.log('1', path[1])
        console.log('2', path[2])

        switch (req.method) {
            case 'POST': {
                body.id = uuid();
                body.name = req.body.name;
                break;
            }
        }
    }
}
