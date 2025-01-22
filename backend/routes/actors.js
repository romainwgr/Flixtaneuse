//backend/routes/actors.js
const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorsController.js');

router.get('/search', actorsController.searchActorByName);
router.get('/famous',actorsController.getFamousActorsFilms);

router.get('/:id', actorsController.getActorById);

// Prendre les films d'un acteurs getActorFilms
module.exports = router;
