const express = require('express');


const app = express.Router();

const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority',function(err, client){


if (err) throw err;
console.log('Connected to MongoDB!');
const db = client.db('requestservice');

const collection = db.collection('request');
const maintainServiceCollection = db.collection('maintainservice');


  !// category api

  app.get('/api/maintainSerice', function(req, res) {
    maintainServiceCollection.find({}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
  });

  !// Define the API endpoint here...


  app.get('/api/mycollection', function(req, res) {
    collection.find({}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
  });





!// sub cat with id


app.get("/categories/:pname/sub-categories", async (req, res) => {
  try {
    // const db = req.app.locals.db;
    const pname = req.params.pname;
    const collection = db.collection('subcategory');
    collection.find({pname}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



!// full categories search


app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    res.status(400).send('Search term is missing');
    return;
  }

  try {
    const client = await MongoClient.connect(process.env.DATABASE|| 'mongodb+srv://kuza:kuza12345@cluster0.kpotsvr.mongodb.net/?retryWrites=true&w=majority');
    const db = client.db('requestservice');
    const collection = db.collection('subcategory');
    const results = await collection.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error searching for products');
  }
});






})



module.exports = app;