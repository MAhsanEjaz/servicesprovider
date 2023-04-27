const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  userName:({
    type: String,
    require: true
  }),

  items: [
    {
      id: String,
      name: String,
      price: Number,
      instruction: String,
      qty:Number
  
    }
  ],
  total: Number
});

// module.exports = mongoose.model('cart',checkoutSchema);

const cart = mongoose.model('checkoutcart', checkoutSchema);

module.exports = cart;