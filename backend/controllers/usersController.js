const User = require('../models/User');
const argon2 = require('argon2'); 
const jwt = require('jsonwebtoken');
const Like = require('../models/Like')
const Film = require('../models/Film');
// Créer un utilisateur (inscription)
const createUser = async (req, res) => {
    try {
        const { name, public_name, email, password } = req.body;
        // Validation des champs requis
        if (!name || !public_name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
        }

        // Vérification de l'existence d'un utilisateur
        const existingUser = await User.findOne({ $or: [{ email }, { public_name }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ou pseudonyme déjà utilisé.' });
        }

        // Hachage sécurisé du mot de passe avec Argon2
        const hashedPassword = await argon2.hash(password);

        const user = new User({
            name,
            public_name,
            email,
            password: hashedPassword
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

        // Validation des champs requis
        if (!email || !password) {
            console.warn("Email ou mot de passe manquant.");
            return res.status(400).json({ message: 'Email et mot de passe requis.' });
        }

        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            console.warn("Utilisateur non trouvé pour l'email :", email);
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log("Utilisateur trouvé :", {
            id: user._id,
            email: user.email,
            public_name: user.public_name,
            password: user.password
        });

        // Vérification du mot de passe avec Argon2
        const isPasswordValid = await argon2.verify(user.password, password);
        console.log("Résultat de la vérification du mot de passe :", isPasswordValid);

        if (!isPasswordValid) {
            console.warn("Mot de passe incorrect pour l'utilisateur :", email);
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Génération d'un token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Clé secrète
            { expiresIn: '1h' } // Expiration
        );

        console.log("Token généré avec succès :", token);

        // Envoi du token dans la réponse JSON
        res.status(200).json({
            message: 'Connexion réussie.',
            token, // Retourne le token directement dans la réponse
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

        // Utiliser l'ID extrait du token JWT
        const userId = req.user.id;

        // Validation des données mises à jour (optionnel, peut être renforcé)
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Aucune mise à jour fournie.' });
        }

        // Mise à jour de l'utilisateur
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
        // Utiliser l'ID extrait du token JWT
        const userId = req.user.id;

        // Suppression de l'utilisateur
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

const getUserProfile = async (req, res) => {
    console.log('get userprofil lancé');
    try {
        const userId = req.user.id; // Récupère l'ID utilisateur du token décodé
        const user = await User.findById(userId).select("-password"); // Exclut le mot de passe

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        res.status(500).json({ message: "Erreur lors de la récupération du profil." });
    }
};

const getLikedFilms = async(req,res) => {
    try {
        const userId = req.user.id;
    
        // Récupère les 5 films aimés les plus récents
        const recentLikedFilms = await Like.find({ userId })
          .populate('filmId') // Jointure avec la collection Movie
          .sort({ createdAt: -1 }) // Trie par date décroissante (-1 pour décroissant)
          .limit(5); // Limite à 5 films
    
        // const films = recentLikedFilms.map((like) => like.filmId);

        // Filtrer les films nuls
        const films = recentLikedFilms
        .map((like) => like.filmId) // Extraire les films

        res.status(200).json(films);
      } catch (error) {
        console.error("Erreur lors de la récupération des films récents aimés :", error.message);
        res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
      }
}



module.exports = {
    createUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    deleteUser,
    getLikedFilms,
};



// Modifier l'image de profil
// const updateProfileImage = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { profil_image } = req.body;

//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'ID invalide.' });
//         }

//         if (!profil_image) {
//             return res.status(400).json({ message: "L'URL de l'image est requise." });
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, { profil_image }, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         res.json({ message: "Image de profil mise à jour avec succès.", updatedUser });
//     } catch (err) {
//         res.status(500).json({ message: "Erreur lors de la mise à jour de l'image de profil.", error: err.message });
//     }
// };

// // Récupérer tous les utilisateurs
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
//     }
// };


// Récupérer les films aimés d'un utilisateur 
// TODO c'est l'utilisateur connecté peut etre y a un moyen plus simple et econome
// const getLikedMovies = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'ID invalide.' });
//         }

//         const user = await User.findById(id).populate('liked_movies');
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         res.json({ liked_movies: user.liked_movies });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des films aimés.' });
//     }
// };

// Ajouter un film aux liked_movies d'un utilisateur
// TODO c'est l'utilisateur connecté peut etre y a un moyen plus simple et econome

// const addLikedMovie = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { movieId } = req.body;

//         if (!id || !mongoose.Types.ObjectId.isValid(id) || !movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
//             return res.status(400).json({ message: 'ID utilisateur ou film invalide.' });
//         }

//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         if (user.liked_movies.includes(movieId)) {
//             return res.status(400).json({ message: 'Ce film est déjà dans les films aimés.' });
//         }

//         user.liked_movies.push(movieId);
//         await user.save();

//         res.json({ message: 'Film ajouté aux films aimés.', liked_movies: user.liked_movies });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de l’ajout du film.', error: err.message });
//     }
// };

// Récupérer les films notés d'un utilisateur
// TODO c'est l'utilisateur connecté peut etre y a un moyen plus simple et econome

// const getRatedMovies = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'ID invalide.' });
//         }

//         const user = await User.findById(id).populate('rated_movies.movie');
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         res.json({ rated_movies: user.rated_movies });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des films notés.' });
//     }
// };

// // Ajouter une note à un film
// const addRatedMovie = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { movieId, rating, comment } = req.body;

//         if (!id || !mongoose.Types.ObjectId.isValid(id) || !movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
//             return res.status(400).json({ message: 'ID utilisateur ou film invalide.' });
//         }

//         if (rating < 0 || rating > 5) {
//             return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
//         }

//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         const alreadyRated = user.rated_movies.find((rm) => rm.movie.toString() === movieId);
//         if (alreadyRated) {
//             return res.status(400).json({ message: 'Ce film a déjà été noté.' });
//         }

//         user.rated_movies.push({ movie: movieId, rating, comment });
//         await user.save();

//         res.json({ message: 'Film noté avec succès.', rated_movies: user.rated_movies });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la notation du film.', error: err.message });
//     }
// };

// // Mettre à jour le numéro de téléphone
// const updatePhoneNumber = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { phone } = req.body;

//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'ID invalide.' });
//         }

//         if (!phone) {
//             return res.status(400).json({ message: 'Le numéro de téléphone est requis.' });
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, { phone }, { new: true, runValidators: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
//         }

//         res.json({ message: 'Numéro de téléphone mis à jour avec succès.', user: updatedUser });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la mise à jour du numéro de téléphone.', error: err.message });
//     }
// };

