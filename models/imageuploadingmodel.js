const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: false
    }
  }]
});

const Post = mongoose.model('imageuploading', postSchema);

module.exports = Post;
