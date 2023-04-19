const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  userName:({
    type: String,
    require: true
  }),

  items: [
    {
      id: String,
      title: String,
      description: String,
  
      }
  ],
  total: Number
});

module.exports = mongoose.model('cart',checkoutSchema);