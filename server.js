var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var Person = require('./app/models/person');
var uuidv4 = require('uuid/v4');
var app = express();
var port = process.env.port || 8000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://wssim:teste123@ds225902.mlab.com:25902/personbase', {
    useNewUrlParser: true,
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.use(function (req, res, next) {
    console.log('Algo está acontecendo aqui...');
    next();
});

//Testando uma rota exemplo:
router.get('/', function (req, res) {
    res.json({ message: 'Beleza! Bem vindo' })
});

//API's:
//Rotas que terminarem com '/person' (servir: GET ALL & POST)

router.route('/person')

    .post(function (req, res) {

        var person = new Person();
        person.name = req.body.name;
        person.id = uuidv4();

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

router.route('/person/:person_id')

    .get(function (req, res) {

        //Função para poder selecionar um determinado person por ID, depois verifica, se caso não encontrar o ID, retorna msg de erro!
        Person.findById(req.params.person_id, function (error, person) {
            if (error)
                res.send('Erro ao tentar encontrar o ID da pessoa');
            res.json(person);

        })
    })

    //PUT encontrar o id
    .put(function (req, res) {
        Person.findById(req.params.person_id, function (error, person) {
            if (error)
                res.send('Id da pessoa não foi encontrado....: ', error);
            person.name = req.body.name;
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
app.listen(port, () => {
    console.log('Express is running on port ' + port);
});

