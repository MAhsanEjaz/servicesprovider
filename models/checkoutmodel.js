const mongoose = require('mongoose');

const checkout = mongoose.Schema({

  userId:{
    type:String,
    required: true },

    items:{

    type: Array,
    required: true

  }

})

module.exports = mongoose.model('checkoutmodel',checkout);