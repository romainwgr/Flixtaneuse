const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Like = require('../models/Like');
const Film = require('../models/Film');
const Watchlater = require('../models/Watchlater');
const Rating = require('../models/Rating'); // Importe le modèle Rating

// Créer un utilisateur (inscription)
const createUser = async (req, res) => {
  try {
    const { name, public_name, email, password } = req.body;
    if (!name || !public_name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { public_name }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou pseudonyme déjà utilisé.' });
    }

    const hashedPassword = await argon2.hash(password);

    const user = new User({
      name,
      public_name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur.', error: err.message });
  }
};

// Se connecter (authentification)
const loginUser = async (req, res) => {
  console.log('Début de la fonction loginUser');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("Email ou mot de passe manquant.");
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("Utilisateur non trouvé pour l'email :", email);
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log("Utilisateur trouvé :", {
      id: user._id,
      email: user.email,
      public_name: user.public_name,
      password: user.password,
    });

    const isPasswordValid = await argon2.verify(user.password, password);
    console.log("Résultat de la vérification du mot de passe :", isPasswordValid);

    if (!isPasswordValid) {
      console.warn("Mot de passe incorrect pour l'utilisateur :", email);
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Token généré avec succès :", token);

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        public_name: user.public_name,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ message: 'Erreur lors de la connexion.', error: err.message });
  }
};

// Modifier le profil d'un utilisateur
const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Aucune mise à jour fournie.' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Profil mis à jour avec succès.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil :', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.', error: err.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Utilisateur supprimé avec succès.',
      user: deletedUser,
    });
  } catch (err) {
    console.error('Erreur lors de la suppression de l’utilisateur :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur.', error: err.message });
  }
};

// Récupérer le profil de l'utilisateur
const getUserProfile = async (req, res) => {
  console.log('get userprofil lancé');
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération du profil :", err);
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};

// Récupérer les films aimés par l'utilisateur
const getLikedFilms = async (req, res) => {
  try {
    const userId = req.user.id;
    const recentLikedFilms = await Like.find({ userId })
      .populate('filmId')
      .sort({ createdAt: -1 })
      .limit(10);

    const films = recentLikedFilms
      .map((like) => like.filmId)
      .filter((film) => film !== null);

    res.status(200).json(films);
  } catch (error) {
    console.error("Erreur lors de la récupération des films récents aimés :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
  }
};

// Récupérer les films à regarder plus tard par l'utilisateur
const getWatchLater = async (req, res) => {
  try {
    const userId = req.user.id;
    const recentWatchFilms = await Watchlater.find({ userId })
      .populate('filmId')
      .sort({ createdAt: -1 })
      .limit(10);

    const films = recentWatchFilms
      .map((watchlater) => watchlater.filmId)
      .filter((film) => film !== null);

    res.status(200).json(films);
  } catch (error) {
    console.error("Erreur lors de la récupération des films récents aimés :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
  }
};

// Récupérer les films notés par l'utilisateur
const getRatedFilms = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratedFilms = await Rating.find({ userId })
      .populate('filmId')
      .sort({ createdAt: -1 })
      .limit(10);

    const films = ratedFilms
      .map((rating) => rating.filmId)
      .filter((film) => film !== null);

    res.status(200).json(films);
  } catch (error) {
    console.error("Erreur lors de la récupération des films notés :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  getLikedFilms,
  getWatchLater,
  getRatedFilms, 
};