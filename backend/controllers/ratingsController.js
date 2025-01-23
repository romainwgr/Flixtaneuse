const Rating = require('../models/Rating');

// Noter un film
const rateFilm = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur
    const filmId = req.params.id; // ID du film
    const { rating } = req.body; // Note donnée par l'utilisateur

    console.log(userId);
    console.log(filmId);
    console.log('Notation en cours...');

    // Vérifie si l'utilisateur a déjà noté ce film
    const existingRating = await Rating.findOne({ userId, filmId });

    if (existingRating) {
      // Met à jour la note existante
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json({ message: 'Note mise à jour avec succès.', rating: existingRating.rating });
    }

    // Crée une nouvelle note
    const newRating = new Rating({ userId, filmId, rating });
    await newRating.save();

    res.status(201).json({ message: 'Film noté avec succès.', rating: newRating.rating });
  } catch (error) {
    console.error('Erreur lors de la notation du film :', error);
    res.status(500).json({ message: 'Erreur lors de la notation du film.', error: error.message });
  }
};

// Récupérer la note de l'utilisateur pour un film
const getUserRating = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur
    const filmId = req.params.id; // ID du film

    console.log(userId);
    console.log(filmId);
    console.log('Récupération de la note...');

    // Vérifie si l'utilisateur a noté ce film
    const rating = await Rating.findOne({ userId, filmId });

    if (rating) {
      res.status(200).json({ rating: rating.rating });
    } else {
      res.status(200).json({ rating: 0 }); // Si l'utilisateur n'a pas encore noté le film
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la note :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la note.', error: error.message });
  }
};

// Supprimer la note de l'utilisateur pour un film
const deleteRating = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur
    const filmId = req.params.id; // ID du film

    console.log(userId);
    console.log(filmId);
    console.log('Suppression de la note...');

    // Supprime la note
    const result = await Rating.findOneAndDelete({ userId, filmId });

    if (!result) {
      return res.status(404).json({ message: 'Note non trouvée.' });
    }

    res.status(200).json({ message: 'Note supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la note.', error: error.message });
  }
};

// Exporte les fonctions individuellement
module.exports = {
  rateFilm,
  getUserRating,
  deleteRating,
};