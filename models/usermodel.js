const mongoose = require('mongoose');


const myUser = mongoose.Schema({

    name:({

        type: String,
        required: true

    }),

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