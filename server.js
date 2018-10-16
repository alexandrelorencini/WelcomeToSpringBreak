var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var Person = require('./api/Schemas');
var uuidv4 = require('uuid/v4');
var globals = require('./constants')
var MUUID = require('uuid-mongodb');
var app = express();
var port = process.env.port || 8000;
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://wssim:teste123@ds225902.mlab.com:25902/personbase', {
    useNewUrlParser: true,
})

router.route('/person')

    .post(function (req, res) {
        const person = new Person();
        const UUIDV4 = MUUID.v4();
        person.name = req.body.name;
        person.id = UUIDV4.toString();
        person.save(function (error) {
            if (error)
                res.send(422, `${globals.MSG_POST_ERROR} ${'\n'}${error}`);
            res.json({ id: person.id });
        });
    })

    .get(function (req, res) {
        Person.find(function (error, person) {
            if (error)
                res.send(globals.MSG_ERROR_CONECT_MLAB + error);
            res.json(person);
        })
    })

router.route('/person/:person_id')

    .get(function (req, res) {
        Person.findById(req.params.person_id, function (error, person) {
            if (error)
                res.send(404, globals.MSG_ID_NOT_fOUND);
            res.json(person);

        })
    })

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
                    res.status(404).send(globals.MSG_ID_NOT_fOUND);
                res.json({ message: 'Pessoa excluida com Sucesso!' });
            })
    })

app.use('/api', router);
app.listen(port, () => {
    console.log('Express is running on port ' + port);
});

