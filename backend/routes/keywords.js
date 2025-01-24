//backend/routes/keywords.js
const express = require('express');
const router = express.Router();
const filmsController = require('../controllers/filmsController.js');

router.get('/home', filmsController.getFilmsByKeywords);


module.exports = router;
