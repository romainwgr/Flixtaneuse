const mongoose = require('mongoose');

// Définition du schéma Keyword
const keywordSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  name: { 
    type: String, 
    required: true
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Film', 
      required: true
    }
  ]
});

// Export du modèle
module.exports = mongoose.model('Keyword', keywordSchema);
