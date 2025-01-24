const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  genres: {
    type: mongoose.Schema.Types.Mixed, // Objet flexible { genreId: score }
    default: {},
  },
  actors: {
    type: mongoose.Schema.Types.Mixed, // Objet flexible { actorId: score }
    default: {},
  },
  directors: {
    type: mongoose.Schema.Types.Mixed, // Objet flexible { directorId: score }
    default: {},
  },
  keywords: {
    type: mongoose.Schema.Types.Mixed, // Objet flexible { keywordId: score }
    default: {},
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  public_name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Email invalide.',
    },
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  liked_movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
    },
  ],
  rated_movies: [
    {
      movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
    },
  ],
  password: {
    type: String,
    required: true,
  },
  profil_image: {
    type: String,
    default: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
  },
  preferences: preferencesSchema, // Intégration du sous-document
});

module.exports = mongoose.model('User', userSchema);