const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    myName: String,
    price: String
  });


module.exports = mongoose.model('checkout', productSchema);