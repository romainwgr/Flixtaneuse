const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Récupérer tous les utilisateurs
router.get('/', usersController.getAllUsers);

// Créer un nouvel utilisateur (inscription)
router.post('/', usersController.createUser);

// Se connecter (authentification)
router.post('/login', usersController.loginUser);

// // Récupérer un utilisateur par ID
// router.get('/:id', usersController.getUserById);

// Mettre à jour le profil de l'utilisateur
router.put('/:id', usersController.updateUserProfile);

// // Mettre à jour l'image de profil
// router.patch('/:id/image', usersController.updateProfileImage);

// // Récupérer les films aimés
// router.get('/:id/liked-movies', usersController.getLikedMovies);

// // Ajouter un film aux films aimés
// router.post('/:id/liked-movies', usersController.addLikedMovie);

// // Récupérer les films notés
// router.get('/:id/rated-movies', usersController.getRatedMovies);

// // Ajouter une note à un film
// router.post('/:id/rated-movies', usersController.addRatedMovie);

// // Mettre à jour le numéro de téléphone
// router.patch('/:id/phone', usersController.updatePhoneNumber);

// Supprimer un utilisateur
router.delete('/:id', usersController.deleteUser);

module.exports = router;
