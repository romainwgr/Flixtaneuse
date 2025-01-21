// backend/routes/watchlater.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../routes/authMiddleWare');
const watchlaterController = require('../controllers/watchlaterController');

// Routes
router.post('/:id/addToWatchLater', isAuthenticated, watchlaterController.addToWatchLater); // Ajouter un film à "Regarder Plus Tard"
router.delete('/:id/removeFromWatchLater', isAuthenticated, watchlaterController.removeFromWatchLater); // Retirer un film de "Regarder Plus Tard"
router.get('/:id/isInWatchLater', isAuthenticated, watchlaterController.isInWatchLater); // Vérifier si le film est dans "Regarder Plus Tard"
router.post('/film', isAuthenticated, watchlaterController.getWatchLater);
module.exports = router;
