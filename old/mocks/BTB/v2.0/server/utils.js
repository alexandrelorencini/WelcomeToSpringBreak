const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./server/db/db.json');
const db = low(adapter);

exports.findResourceById = (resourceName, id) => {
    return db
        .get(resourceName)
        .find({ id })
        .value();
};


exports.nextMetaElementOrder = () => {
    const getElements = db.get('meta-elements').value();
    const getOrders = getElements.map(getElements => getElements.order);
    return Math.max.apply(null, getOrders) + 1;
}