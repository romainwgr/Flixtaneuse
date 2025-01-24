const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Ajout du champ "rating" pour stocker la note
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('rating', ratingSchema); // Correction ici