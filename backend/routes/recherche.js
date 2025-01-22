const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../routes/authMiddleWare');
const rechercheController = require('../controllers/recherche/rechercheController');

router.get('/search', rechercheController.searchFilmByTitle);
