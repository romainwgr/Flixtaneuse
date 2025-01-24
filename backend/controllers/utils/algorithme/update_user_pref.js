const User = require('../../../models/User'); // Modèle utilisateur
const Film = require('../../../models/Film'); // Modèle film
const Actor = require('../../../models/Actor'); // Modèle acteur
const Director = require('../../../models/Director'); // Modèle réalisateur
const Keyword = require('../../../models/Keyword'); // Modèle mot-clé
const WEIGHTS = require('./config/pref_weight'); // Import des pondérations

const addUserPref = async (userId, filmId) => {
    try {
      // Vérifiez que WEIGHTS est correctement défini
      if (!WEIGHTS || !WEIGHTS.GENRE || !WEIGHTS.ACTOR || !WEIGHTS.DIRECTOR || !WEIGHTS.KEYWORD) {
        throw new Error('Les pondérations (WEIGHTS) ne sont pas correctement définies.');
      }
  
      const film = await Film.findById(filmId);
      if (!film) {
        throw new Error('Film introuvable');
      }
  
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }
  
      // Vérifie et initialise les préférences si elles sont absentes
      if (!user.preferences) {
        user.preferences = {
          genres: {},
          actors: {},
          directors: {},
          keywords: {},
        };
      }
  
      const preferences = user.preferences;
  
      // Mise à jour des genres
      film.genres.forEach((genre) => {
        const genreId = genre.id.toString(); // Convertir en chaîne
        const currentScore = parseFloat(preferences.genres[genreId]) || 0; // Valeur actuelle ou 0
        const newScore = currentScore + WEIGHTS.GENRE; // Calculer newScore
  
        preferences.genres[genreId] = newScore; // Mettre à jour le score
      });
  
      // Mise à jour des acteurs
      const actors = await Actor.find({ _id: { $in: film.actors } });
      actors.forEach((actor) => {
        const actorId = actor._id.toString(); // Convertir en chaîne
        const currentScore = parseFloat(preferences.actors[actorId]) || 0; // Valeur actuelle ou 0
        const newScore = currentScore + WEIGHTS.ACTOR; // Calculer newScore
  
        preferences.actors[actorId] = newScore; // Mettre à jour le score
      });
  
      // Mise à jour des réalisateurs
      const directors = await Director.find({ _id: { $in: film.directors } });
      directors.forEach((director) => {
        const directorId = director._id.toString(); // Convertir en chaîne
        const currentScore = parseFloat(preferences.directors[directorId]) || 0; // Valeur actuelle ou 0
        const newScore = currentScore + WEIGHTS.DIRECTOR; // Calculer newScore
  
        preferences.directors[directorId] = newScore; // Mettre à jour le score
      });
  
      // Mise à jour des mots-clés
      const keywords = await Keyword.find({ movies: filmId });
      keywords.forEach((keyword) => {
        const keywordId = keyword._id.toString(); // Convertir en chaîne
        const currentScore = parseFloat(preferences.keywords[keywordId]) || 0; // Valeur actuelle ou 0
        const newScore = currentScore + WEIGHTS.KEYWORD; // Calculer newScore
  
        preferences.keywords[keywordId] = newScore; // Mettre à jour le score
      });
  
      // Sauvegarder les préférences
      user.markModified('preferences');
      await user.save();
      console.log('Préférences mises à jour avec succès:', user.preferences); // Debug
    } catch (error) {
      console.error('Erreur dans addUserPref :', error.message);
      throw error;
    }
  };
  const delUserPref = async (userId, filmId) => {
    try {
      const film = await Film.findById(filmId);
      if (!film) {
        throw new Error('Film introuvable');
      }
  
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }
  
      if (!user.preferences) {
        user.preferences = {
          genres: {},
          actors: {},
          directors: {},
          keywords: {},
        };
      }
  
      const preferences = user.preferences;
  
      film.genres.forEach((genre) => {
        const genreId = genre.id.toString(); // Convertir en chaîne
        if (preferences.genres[genreId]) {
          const currentScore = parseFloat(preferences.genres[genreId]) || 0;
          const newScore = currentScore - WEIGHTS.GENRE; // Calculer newScore
  
          if (newScore <= 0) {
            delete preferences.genres[genreId]; // Supprimer si le score est <= 0
          } else {
            preferences.genres[genreId] = newScore; // Mettre à jour le score
          }
        }
      });
  
      // Mise à jour des acteurs
      const actors = await Actor.find({ _id: { $in: film.actors } });
      actors.forEach((actor) => {
        const actorId = actor._id.toString();
        if (preferences.actors[actorId]) {
          const currentScore = parseFloat(preferences.actors[actorId]) || 0;
          const newScore = currentScore - WEIGHTS.ACTOR; // Calculer newScore
  
          if (newScore <= 0) {
            delete preferences.actors[actorId]; // Supprimer si le score est <= 0
          } else {
            preferences.actors[actorId] = newScore; // Mettre à jour le score
          }
        }
      });
  
      // Mise à jour des réalisateurs
      const directors = await Director.find({ _id: { $in: film.directors } });
      directors.forEach((director) => {
        const directorId = director._id.toString();
        if (preferences.directors[directorId]) {
          const currentScore = parseFloat(preferences.directors[directorId]) || 0;
          const newScore = currentScore - WEIGHTS.DIRECTOR; // Calculer newScore
  
          if (newScore <= 0) {
            delete preferences.directors[directorId]; // Supprimer si le score est <= 0
          } else {
            preferences.directors[directorId] = newScore; // Mettre à jour le score
          }
        }
      });
  
      // Mise à jour des mots-clés
      const keywords = await Keyword.find({ movies: filmId });
      keywords.forEach((keyword) => {
        const keywordId = keyword._id.toString();
        if (preferences.keywords[keywordId]) {
          const currentScore = parseFloat(preferences.keywords[keywordId]) || 0;
          const newScore = currentScore - WEIGHTS.KEYWORD; // Calculer newScore
  
          if (newScore <= 0) {
            delete preferences.keywords[keywordId]; // Supprimer si le score est <= 0
          } else {
            preferences.keywords[keywordId] = newScore; // Mettre à jour le score
          }
        }
      });
  
      // Sauvegarder les préférences
      user.markModified('preferences');
      await user.save();
      console.log('Préférences mises à jour avec succès:', user.preferences); // Debug
    } catch (error) {
      console.error('Erreur dans delUserPref :', error.message);
      throw error;
    }
  };
module.exports = { addUserPref, delUserPref };