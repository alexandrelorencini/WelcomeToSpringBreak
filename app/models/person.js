//mongoose - cria uma classe para comunicar o node x mongodb

/**
 * Arquivo: person.js
 * Author: Alexandre Daniel Lorencini
 * Descrição: Arquivo responsavel para gerenciar o cadastramento de pessoas.
 * Data: 25/07/2018
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var personSchema = new Schema({
    nome: String
});

module.exports = mongoose.model('Person', personSchema);