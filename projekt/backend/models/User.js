const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    registrationDate: Date,
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        required: true
    }

});

module.exports = model('User', userSchema);