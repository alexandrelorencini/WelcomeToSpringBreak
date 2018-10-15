/**
 * GENERIC METHOD TO GET THE NEXT SUFIX OF A KEY
 */
exports.getNextSufix = function (key) {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./db/index.json');
  const db = low(adapter);
  const sufix = db.get(key).find({ name: "sufix" }).value().value;
  db.get(key).find({ name: "sufix" }).assign({ value: (sufix + 1) }).write();
  return sufix;
}

/**
 * GENERIC METHOD TO GET THE NAME OF A CUSTOM FIELD
 */
exports.getNameOfCustomField = function (id) {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./db/db.json');
  const db = low(adapter);
  let custom_fields = db.get('custom-fields').value();
  for (var i = 0; i < custom_fields.length; i++) {
    if (custom_fields[i].id === id) {
      return custom_fields[i].name;
    }
  }
  return null;
}

/**
 * GENERIC METHOD TO GET THE TYPE OF A CUSTOM FIELD
 */
exports.getTypeOfCustomField = function (id) {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./db/db.json');
  const db = low(adapter);
  let custom_fields = db.get('custom-fields').value();
  for (var i = 0; i < custom_fields.length; i++) {
    if (custom_fields[i].id === id) {
      return custom_fields[i].type;
    }
  }
  return null;
}

/**
 * GENERIC METHOD TO GET THE TYPE OF A CUSTOM FIELD
 */
exports.getApiAndResourceOfCustomField = function (id) {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./db/db.json');
  const db = low(adapter);
  let custom_fields = db.get('custom-fields').value();
  for (var i = 0; i < custom_fields.length; i++) {
    if (custom_fields[i].id === id) {
      return { api: custom_fields[i].api, resource: custom_fields[i].resource};
    }
  }
  return null;
}

/**
 * GENERIC METHOD TO GET THE ORDER OF CUSTOM FIELDS
 */
exports.getOrderCustomField = function (data) {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./db/db.json');
  const db = low(adapter);
  let custom_fields = db.get('custom-fields').value();
  if (data instanceof Array) {
    for (let i = 0; i < custom_fields.length; i++) {
      data[i].order = (i + 1);
    }
    return data;
  } else {
    for (let i = 0; i < custom_fields.length; i++) {
      if (custom_fields[i].id === data) {
        return (i + 1);
      }
    }
    return undefined;
  }
}
