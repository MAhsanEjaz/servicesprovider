const express = require('express');

const app = express();

const ROUTER = require('./routes/routes');

const bodyparser = require('body-parser');

app.use('/router',ROUTER);

app.use(express.json());

app.use(bodyparser.json());


const PORT = process.env.PORT|| 3000;


app.listen(PORT);