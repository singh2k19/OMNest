const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title: {type: String , required: true},
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],
  videos: [String],
  comments: [commentSchema],
});

module.exports = mongoose.model('Post', postSchema);
