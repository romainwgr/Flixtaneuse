const mongoose = require('mongoose');

const watchlaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlater', watchlaterSchema);
