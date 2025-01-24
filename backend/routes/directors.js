//backend/routes/directors.js
const express = require('express');
const router = express.Router();
const directorsController = require('../controllers/directorsController.js');

router.get('/search', directorsController.searchDirectorByName);
router.get('/famous',directorsController.getFamousDirectorsFilms);

router.get('/:id', directorsController.getDirectorById);
module.exports = router;
