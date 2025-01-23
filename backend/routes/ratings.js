const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./authMiddleWare');
const ratingsController = require('../controllers/ratingsController');

// Routes pour la notation
router.post('/:id/rate', isAuthenticated, ratingsController.rateFilm); // Noter un film
router.get('/:id/userRating', isAuthenticated, ratingsController.getUserRating); // Récupérer la note de l'utilisateur
router.delete('/:id/deleteRating', isAuthenticated, ratingsController.deleteRating); // Supprimer la note

module.exports = router;