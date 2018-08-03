let port;
process.argv[2] ? port = process.argv[2].split('=')[1] : port = 3003;

const bodyParser = require('body-parser');
const express = require('express');
const server = express();

server.use(bodyParser.json());

server.listen(port, () => {
    console.log(`Mock is running on port ${port}`);
});

module.exports = server;
