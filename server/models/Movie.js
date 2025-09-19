const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  rating: { type: Number, required: true },
  description: String,
  posterUrl: String,
});

module.exports = mongoose.model('Movie', MovieSchema);
