const express = require('express');
// const fetch = require('');


const app = express.Router();

const CheckoutModel = require('../models/checkoutmodel');



const imageData = require('../models/imageuploadingmodel');


const Product = require('../models/checkoutmodel');




const multer = require('multer');

app.use(express.static('uploads'))

const MongoClient = require('mongodb').MongoClient;



app.post('/api/checkout', (req, res) => {
  const { userId, items } = req.body;

  const cart = new CheckoutModel({
    userId,
    items
  });

  cart.save((err, cart) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving cart');
    } else {
      res.send('Cart saved successfully');
    }
  });
});


app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  CheckoutModel.findOne({ userId }, (err, cart) => {
    if (err) {
      console.error(err);
      res.status(500).json('Error retrieving cart');
    } else {
      res.send(cart);
    }
  });
});



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

// cart database find with id

app.get("/categories/:pname/cart-categories", async (req, res) => {
    try {
      // const db = req.app.locals.db;
      const pname = req.params.pname;
      const collection = db.collection('cartdatabase');
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


// Set up Multer to handle image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create a new post with multiple images
app.post('/image', upload.array('images'), async (req, res) => {
  try {
    const { title } = req.body;
    const images = req.files.map(file => {
      return { url: `${file.filename}`, caption: '' };
    });

    const post = new imageData({ title, images });
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/multi',async(req, res)=>{
  const post = await imageData.find();
  res.json(post);
})



app.post('/api/products', async (req, res) => {
  const product = new Product({
    myName: req.body.myName,
    price: req.body.price
  });
  await product.save();
  res.send(product);
});









module.exports = app;