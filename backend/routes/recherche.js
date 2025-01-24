const express = require('express');
const router = express.Router();
const rechercheController = require('../controllers/recherche/rechercheController');
const { useUserPref } = require('../routes/authMiddleWare'); // Import du middleware

router.get('/search', useUserPref,rechercheController.searchFilmByTitle);

module.exports = router;
