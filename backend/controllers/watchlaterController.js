const Watchlater = require('../models/Watchlater');

const addToWatchLater = async (req, res) => {
    try {
        const userId = req.user.id; // Récupérer l'ID de l'utilisateur
        const filmId = req.params.id; // Récupérer l'ID du film

        // Vérifie si le film est déjà dans la liste "Regarder Plus Tard"
        const existingEntry = await Watchlater.findOne({ userId, filmId });
        if (existingEntry) {
            return res.status(400).json({ message: 'Ce film est déjà dans votre liste "Regarder Plus Tard".' });
        }

        // Ajoute le film à la liste "Regarder Plus Tard"
        const newEntry = new Watchlater({ userId, filmId });
        await newEntry.save();

        res.status(201).json({ message: 'Film ajouté à "Regarder Plus Tard" avec succès.' });
    } catch (e) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout à la liste "Regarder Plus Tard".', error: e.message });
    }
};

const removeFromWatchLater = async (req, res) => {
    try {
        const userId = req.user.id; // Récupérer l'ID de l'utilisateur
        const filmId = req.params.id; // Récupérer l'ID du film

        // Supprime le film de la liste "Regarder Plus Tard"
        const result = await Watchlater.findOneAndDelete({ userId, filmId });
        if (!result) {
            return res.status(404).json({ message: 'Film non trouvé dans la liste "Regarder Plus Tard".' });
        }

        res.status(200).json({ message: 'Film retiré de "Regarder Plus Tard" avec succès.' });
    } catch (e) {
        res.status(500).json({ message: 'Erreur lors de la suppression du film de "Regarder Plus Tard".', error: e.message });
    }
};

const isInWatchLater = async (req, res) => {
    try {
        const userId = req.user.id; // Récupérer l'ID de l'utilisateur
        const filmId = req.params.id; // Récupérer l'ID du film

        // Vérifie si le film est dans la liste "Regarder Plus Tard"
        const isInWatchLater = await Watchlater.exists({ userId, filmId });
        res.status(200).json({ isInWatchLater });
    } catch (e) {
        res.status(500).json({ message: 'Erreur lors de la vérification de la liste "Regarder Plus Tard".', error: e.message });
    }
};


module.exports = {
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
};
