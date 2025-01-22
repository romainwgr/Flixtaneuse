const Film = require('../models/Film');
const mongoose = require('mongoose');
const Actor = require('../models/Actor'); // Ajustez le chemin selon votre structure
const Director = require('../models/Director'); // Assurez également l'import de Director


// Récupérer 100  films test
// Pour la page d'accueil
const getAllFilms = async (req, res) => {
    try {
        const films = await Film.find().limit(100); // Limite à 100 films
        res.json(films);
    } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des films.' });
    }
};


// const getAllFilms = async (req, res) => {
//     try {
//         const films = await Film.aggregate([
//             {
//                 $facet: {
//                     action: [
//                         { $match: { genres: { $elemMatch: { name: 'Action' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     romance: [
//                         { $match: { genres: { $elemMatch: { name: 'Romance' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     comedy: [
//                         { $match: { genres: { $elemMatch: { name: 'Comedy' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     drama: [
//                         { $match: { genres: { $elemMatch: { name: 'Drama' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     thriller: [
//                         { $match: { genres: { $elemMatch: { name: 'Thriller' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     scienceFiction: [
//                         { $match: { genres: { $elemMatch: { name: 'Science Fiction' } } } },
//                         { $sort: { vote_count: -1 } },
//                         { $limit: 20 }
//                     ],
//                     randomActors: [
//                         {
//                             $lookup: {
//                                 from: 'actors', // Remplacez 'actors' par le nom correct de votre collection d'acteurs
//                                 localField: 'actors',
//                                 foreignField: '_id',
//                                 as: 'actorDetails'
//                             }
//                         },
//                         { $unwind: '$actorDetails' },
//                         { $match: { 'actorDetails.movieCount': { $gt: 50 } } },
//                         { $sample: { size: 3 } }
//                     ],
//                     belongsToCollection: [
//                         { $match: { belongs_to_collection: { $ne: null } } },
//                         { $group: { _id: "$belongs_to_collection", title: { $first: "$title" } } },
//                         { $sample: { size: 5 } }
//                     ],
//                     best_notes: [
//                         { $sort: { vote_average: -1 } },
//                         { $limit: 20 }
//                     ]
//                 }
//             }
//         ]);

//         res.json(films[0]); // Retourne les résultats sous forme d'objet
//     } catch (err) {
//         res.status(500).json({
//             message: 'Une erreur est survenue lors de la récupération des films.',
//             error: err.message
//         });
//     }
// };


const getFilmsByKeywords = async (req,res) =>{
    
}
// Rechercher un film par titre
const searchFilmByTitle = async (req, res) => {
    try {
        
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: 'Le paramètre "title" est requis.' });
        }

        const films = await Film.find({
            original_title: { $regex: new RegExp(title, 'i') }, // Utilisation explicite de RegExp
        })
            .limit(10); 
        
        console.log(films);
      
        if (films.length === 0) {
            return res.status(404).json({ message: 'Aucun film trouvé.' });
        }

        res.json(films);
    } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la recherche.' });
    }
};

// Récupérer un film par ID
const getFilmById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("ID du film reçu :", id);

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            console.error("ID invalide :", id);
            return res.status(400).json({ message: 'ID invalide.' });
        }

        const film = await Film.findById(id);
        if (!film) {
            console.error("Film non trouvé pour l'ID :", id);
            return res.status(404).json({ message: 'Film non trouvé.' });
        }

        console.log("Film trouvé :", film);

        // Charger les acteurs manuellement
        const actors = await Actor.find({ _id: { $in: film.actors || [] } });
        console.log("Acteurs associés :", actors);

        // Charger les directeurs manuellement
        const directors = await Director.find({ _id: { $in: film.directors || [] } });
        console.log("Directeurs associés :", directors);

        res.json({
            ...film.toObject(),
            actors,
            directors,
        });

    } catch (error) {
        console.error("Erreur interne :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};


// TODO getAllAvisByFilm
// TODO AddAvis
// TODO ModifAvis
// TODO SupprAvis
// TODO RemoveLike
// TODO AddLike
// TODO VoirRecentFilmRecherché

module.exports = {
    getAllFilms,
    searchFilmByTitle,
    getFilmById,
};
