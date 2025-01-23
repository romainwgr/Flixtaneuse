const express = require('express');
const router = express.Router();
const rechercheController = require('../controllers/recherche/rechercheController');

router.get('/search', rechercheController.searchFilmByTitle);

module.exports = router;
