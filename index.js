const express = require('express');

const app = express();


const ROUTER = require('./routes/routes');

app.use(express.static('uploads'))



const mongoose = require('mongoose');

const bodyparser = require('body-parser');


mongoose.connect(process.env.DATABASE||'mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority',(err)=>{
    if(!err){
        console.log('Connected');
    }else{
        console.log('Not connected');}
})

app.use(bodyparser.json());

// app.use(bodyparser.urlencoded({extended: false}));

app.use('/router',ROUTER);

app.use(express.json());

const PORT = process.env.PORT|| 4000;


app.listen(PORT);