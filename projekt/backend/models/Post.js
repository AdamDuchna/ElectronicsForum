const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    creationDate: Date,
    author: {type: Schema.Types.ObjectId, ref: 'User'}

});

module.exports = model('Post', postSchema);