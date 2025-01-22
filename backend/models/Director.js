const mongoose = require('mongoose');

// Définition du schéma Director
const directorSchema = new mongoose.Schema({
  _id: { 
    type: Number, 
    required: true
  },
  name: { 
    type: String, 
    required: true
  },
  movies: [
    {
      id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Film', 
            required: true
          },      
    }
  ]
});

// Export du modèle
module.exports = mongoose.model('Director', directorSchema);
