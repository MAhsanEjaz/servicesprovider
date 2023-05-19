const express = require('express');
const app = express.Router();
const UserData = require('../models/usermodel');
const MyProducts = require('../models/checkoutcart');
const imageData = require('../models/imageuploadingmodel');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt =require("bcrypt");
app.use(express.static('uploads'))

const userModel = require('../models/loginmodel');
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


// Set up Multer to handle image uploads---->

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });





!!// Create a new post with multiple images

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





!!/// multiImages Get Api--------->!!!!

app.get('/multi',async(req, res)=>{
  const post = await imageData.find();
  res.json(post);
})


!!// checkout api------->!!!

app.post('/api/checkout', async (req, res) => {
  try {
    // Create new checkout instance from request body
    const checkout =  new MyProducts({
      userName: req.body.userName,
      total:req.body.total,
       items: req.body.items

    });
    // Save checkout instance to MongoDB
    await checkout.save();
    // Send success response
    res.status(200).json('Checkout saved successfully');
  } catch (err) {
    // Send error response
    res.status(500).json('Internal server error');
    console.log(err);
  }
});



!!// checkOut Data get api----->>>>>>!!

app.get('/api/cart', async (req, res) => {
  const cart = await MyProducts.find();
  res.json(cart)

});



  // Registration API
  app.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);


      const existUser = await userModel.findOne({username});

     
  
      const user = new userModel({
        username: username,
        password: hashedPassword,
        profileImage: req.file.filename,
      });
  
      await user.save();
  
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'An error occurred while registering user' });
    }
  });


  
  // Login API
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await userModel.findOne({ username: username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'secretkey');
  
      res.status(200).json({ token: token ,profileImage: user.profileImage,});
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  });



// !// registration api

// app.post('/register', async (req, res) => {
//   const {name, email, password } = req.body;
//   const existingUser = await UserData.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: 'User already exists' });
//   }
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const newUser =  UserData({ email, password: hashedPassword,name });
//   try {
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


// !// login api


//   app.post('/login/api', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await UserData.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }
//     const token = jwt.sign({ id: user._id }, 'secret');
//     res.status(200).json({ message: 'Login successful', token });
//   });



  


    module.exports = app;