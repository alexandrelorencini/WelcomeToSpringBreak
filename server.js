/**
 * Arquivo: server.js
 * Descrição: Gerenciador e controlador de rotas
 * Author: Alexandre Daniel Lorencini
 * Data de criação: 25/07/2018
 */

//Setup da app

//Chamadas dos pacotes:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var person = require('./app/models/person');

//URI: MLab
mongoose.connect('mongodb://lorencini:ws18012001@ds137957.mlab.com:37957/apibase', {
    useNewUrlParser: true 
});

//Maneira Local: MongoDB:
//mongoose.connect('mongodb://localhost:27017/apibase')

//Configuração da variavel app para usar o 'bodyParser()':
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

//Definição da porta da API
var port = process.env.port || 8000;

//================================================
//Rotas da API:
//================================================

//criando uma instancia das rotas via express:
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Algo está acontecendo aqui...');
    next();
});

//Testando uma rota exemplo:
router.get('/', function (req, res) {
    res.json({ message: 'Beleza! Bem vindo a nossa Loja XYZ' })
});

//Definição de padrão de rotas pré-fixadas: '/api':
app.use('/api', router);

//================================================

//Iniciando a Aplicação (servidor):
app.listen(port, () => {
    console.log('JSON Server is running on port ' + port);
});

