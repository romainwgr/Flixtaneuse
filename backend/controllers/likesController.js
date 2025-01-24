const Like = require('../models/Like');
const { addUserPref, delUserPref } = require('./utils/algorithme/update_user_pref'); 

const like = async (req, res) => {
    try {
        const userId = req.user.id;
        const filmId = req.params.id;


        // Vérifie si le "like" existe déjà
        const existingLike = await Like.findOne({ userId, filmId });
        if (existingLike) {
            return res.status(400).json({ message: 'Vous avez déjà aimé ce film.' });
        }

        // Ajoute un nouveau "like"
        const newLike = new Like({ userId, filmId });
        await newLike.save();

        console.log("dans like function")
        // Met à jour les préférences utilisateur
        await addUserPref(userId, filmId);
        console.log("dans like function après le adduserpref")

        res.status(201).json({ message: 'Film aimé avec succès.' });
    } catch (e) {
        console.error(`Erreur dans like : ${e.message}`);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du film dans les films aimés.', error: e.message });
    }
};

const unlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const filmId = req.params.id;

        // Supprime le "like"
        const result = await Like.findOneAndDelete({ userId, filmId });
        if (!result) {
            return res.status(404).json({ message: 'Like non trouvé.' });
        }

        // Met à jour les préférences utilisateur
        await delUserPref(userId, filmId);

        res.status(200).json({ message: 'Like retiré avec succès.' });
    } catch (e) {
        console.error(`Erreur dans unlike : ${e.message}`);
        res.status(500).json({ message: 'Erreur lors de la suppression du film des films aimés.', error: e.message });
    }
};

const isLiked = async (req, res) => {
    try {
        const userId = req.user.id;
        const filmId = req.params.id;


        // Vérifie l'existence du "like"
        const isLiked = await Like.exists({ userId, filmId });
        res.status(200).json({ isLiked });
    } catch (e) {
        console.error(`Erreur dans isLiked : ${e.message}`);
        res.status(500).json({ message: 'Erreur lors de la recherche si le film est aimé ou non', error: e.message });
    }
};

module.exports = {
    like,
    unlike,
    isLiked,
};
