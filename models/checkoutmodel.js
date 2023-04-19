const mongoose = require('mongoose');

const checkout = mongoose.Schema({

  userId:{
    type:String,
    required: true },

    items:[{
      name: String,
      price: Number,
      quantity: Number,
    },]

})

module.exports = mongoose.model('checkoutmodel',checkout);