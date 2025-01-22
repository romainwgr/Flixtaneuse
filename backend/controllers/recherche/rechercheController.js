const Director = require('../../models/Director');
const Film = require('../../models/Film');
const Actor = require('../../models/Actor.js')
const { getDirectorFilmsById } = require('../utils/utils.js'); 
const { getActorFilmsById } = require('../utils/utils.js');
const jwt = require("jsonwebtoken");


// Fonction gérant l'algorithme de recherche
const searchFilmByTitle = async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ message: "La requête de recherche est vide." });
    }

    // Appel de la fonction pour vérifier le JWT
    const user = verifyAuth(req);

    try {
        let results;

        if (user) {
            // L'utilisateur est connecté : recherche personnalisée
            console.log(`Utilisateur connecté : ${user.id}`);
            results = await Movie.find({
                $or: [
                    { title: { $regex: title, $options: 'i' } },
                    { actors: { $regex: title, $options: 'i' } }
                ]
            }).sort({ popularity: -1 });
        } else {
            // L'utilisateur n'est pas connecté : recherche générique
            console.log("Utilisateur non connecté.");
            results = await Movie.find({
                title: { $regex: title, $options: 'i' }
            }).sort({ popularity: -1 });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};





// Fonction pour vérifier l'authentification via le JWT
const verifyAuth = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Pas de JWT
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        // Décoder le JWT
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log("JWT invalide ou expiré :", err); // Debug
        return null; // JWT invalide ou expiré
    }
};
module.exports = { searchFilmByTitle, verifyAuth };
