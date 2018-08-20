var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Person = require('./app/models/person');
var uuid = require('uuid/v4');

mongoose.Promise = global.Promise;

//Banco MongoDB com MLab Cloud
mongoose.connect('mongodb://lorencini:ws18012001@ds137957.mlab.com:37957/apibase', {
    useNewUrlParser: true
})

/**
* Banco MongoDB Local
* mongoose.connect('mongodb://localhost:27017/apiwsb', {
*     useNewUrlParser: true
* });
**/

//Configuração da variavel app para usar o 'bodyParser()':
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8000;


//Rotas da API:
//================================================

//criando uma instancia das rotas via express:
var router = express.Router();

router.use(function (req, res, next) {
    console.log('Algo está acontecendo aqui...');
    next();
});

//Testando uma rota exemplo:
router.get('/', function (req, res) {
    res.json({ message: 'Beleza! Bem vindo a nossa Loja XYZ' })
});

//API's:
//================================================

//Rotas que terminarem com '/person' (servir: GET ALL & POST)

router.route('/person')

    .post(function (req, res) {

        var person = new Person();
        person.nome = req.body.nome;
        person.id = uuid();

        person.save(function (error) {
            if (error)
                res.send('Erro ao tentar salvar o cadastro de pessoa...: ' + error);

            res.json({ id: person.id });
        });
    })

    .get(function (req, res) {
        Person.find(function (error, person) {
            if (error)
                res.send('Erro ao tentar conectar-se com o banco MLab...: ' + error);
            res.json(person);
        })
    })

//Rotas que terminarem com '/person/:person_id' (servir: GET & PUT & DELETE)

router.route('/person/:person_id')

    .get(function (req, res) {

        //Função para poder selecionar um determinado person por ID, depois verifica, se caso não encontrar o ID, retorna msg de erro!
        Person.findById(req.params.person_id, function (error, person) {
            if (error)
                res.send('Erro ao tentar encontrar o ID da pessoa');
            res.json(person);

        })
    })

    //PUT por ID

    //encontrar o id
    .put(function (req, res) {
        Person.findById(req.params.person_id, function (error, person) {
            if (error)
                res.send('Id da pessoa não foi encontrado....: ', error);

            //buscar do body
            person.nome = req.body.nome;

            //salvar a propriedade
            person.save(function (error) {
                if (error)
                    res.send('Erro ao atualizar a pessoa...: ' + error)

                res.json({ message: 'Pessoa atualizada com sucesso!' })
            });
        });
    })

    .delete(function (req, res) {

        Person.remove({
            _id: req.params.person_id
        },
            function (error) {
                if (error)
                    res.send('Id da pessoa não foi encontrado....: ' + error);

                res.json({ message: 'Pessoa excluida com Sucesso!' });
            })
    })


//Definição de padrão de rotas pré-fixadas: '/api':
app.use('/api', router);

//================================================

//Iniciando a Aplicação (servidor):
app.listen(port, () => {
    console.log('JSON Server is running on port ' + port);
});

