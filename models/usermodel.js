const mongoose = require('mongoose');


const myUser = mongoose.Schema({

    email:({
        type: String,
        required: true,
        unique: true
    }),
    password: ({
        type: String,
        required: true
    })
})


// module.exports = mongoose.model('usermodel', myUser);


const model = mongoose.model('usermodel', myUser);
module.exports = model;