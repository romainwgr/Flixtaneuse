const mongoose = require('mongoose');
const Film = require('../../models/Film');
const Actor = require('../../models/Actor');
const Director = require('../../models/Director');
const Keyword = require('../../models/Keyword');
const jwt = require("jsonwebtoken");


// Fonction pour vérifier le JWT
// Si l'utilisateur est connecté on utilise ses preferences pour améliorer l'algorithme
const verifyAuth = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log("JWT invalide ou expiré :", err);
        return null;
    }
};

const searchFilmByTitle = async (req, res) => {
    try {
        const searchTerm = req.query.title;
        const limit = parseInt(req.query.limit) || 10;
        if (!searchTerm) return res.status(400).json({ error: "Terme de recherche requis" });

        const filmIds = new Set();

        // Fonction de conversion universelle
        const getMovieId = (ref) => {
            if (ref?.$oid) return new mongoose.Types.ObjectId(ref.$oid);
            if (ref instanceof mongoose.Types.ObjectId) return ref;
            return null;
        };

        // Recherche dans les réalisateurs
        const directors = await Director.find({ 
            name: { $regex: searchTerm, $options: 'i' } 
        });
        directors.forEach(d => {
            d.movies.forEach(m => {
                const id = getMovieId(m.id);
                if (id) filmIds.add(id);
            });
        });

        // Recherche dans les acteurs
        const actors = await Actor.find({ 
            name: { $regex: searchTerm, $options: 'i' } 
        });
        actors.forEach(a => {
            a.movies.forEach(m => {
                const id = getMovieId(m.id);
                if (id) filmIds.add(id);
            });
        });

        // Recherche par titre de film
        const filmsByTitle = await Film.find({ 
            title: { $regex: searchTerm, $options: 'i' } 
        });
        filmsByTitle.forEach(f => filmIds.add(f._id));

        // Recherche par mots-clés
        const keywords = await Keyword.find({ 
            name: { $regex: searchTerm, $options: 'i' } 
        });
        keywords.forEach(k => {
            k.movies.forEach(m => {
                const id = getMovieId(m);
                if (id) filmIds.add(id);
            });
        });

        // Recherche par genre
        const filmsByGenre = await Film.find({ 
            'genres.name': { $regex: searchTerm, $options: 'i' } 
        });
        filmsByGenre.forEach(f => filmIds.add(f._id));

        // Conversion en array ObjectId
        const filmIdsArray = Array.from(filmIds).map(id => 
            new mongoose.Types.ObjectId(id)
        );

        // Récupération des films complets
        const results = await Film.find({ 
            _id: { $in: filmIdsArray } 
        })
        .sort({ vote_count: -1, title: 1 })
        .limit(limit+1)
        .lean();

        const hasMore = results.length > limit;
        const films = hasMore ? results.slice(0, -1) : results;

        res.json({
            films,
            hasMore
        });

    } catch (error) {
        console.error('Erreur recherche:', error);
        res.status(500).json({ error: "Erreur lors de la recherche" });
    }
};

module.exports = { searchFilmByTitle };