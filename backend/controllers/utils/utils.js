const Director = require('../../models/Director'); // Assurez-vous de mettre le bon chemin vers votre modèle
const Film = require('../../models/Film'); // Assurez-vous de mettre le bon chemin vers votre modèle
const Actor = require('../../models/Actor')

// Fonction générique pour récupérer les films d'un réalisateur
const getDirectorFilmsById = async (directorId) => {
    try {
        // Trouver le réalisateur avec ses films
        const director = await Director.findOne({ _id: directorId }).populate({
            path: 'movies.id', // Peupler les films
            model: 'Film' // Associer au modèle `Film`
        })

        const sortedMovies = director.movies
        .sort((a, b) => {
            // Calcul du score pour chaque film
            const scoreA = (a.id.vote_average * 2) + Math.log10(a.id.vote_count || 1) + (a.id.popularity / 10);
            const scoreB = (b.id.vote_average * 2) + Math.log10(b.id.vote_count || 1) + (b.id.popularity / 10);
    
            // Comparaison des scores
            return scoreB - scoreA; // Trier par score décroissant
        })
        .slice(0, 10); // Sélectionner les 10 premiers films
    
    
               

        // Vérifier si le réalisateur existe
        if (!director) {
            throw new Error('Réalisateur introuvable');
        }

        // Retourner les informations
        return {
            name: director.name,
            films: sortedMovies.map(movie => movie.id) // Films complets
        };
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des films : ${error.message}`);
    }
}

const getActorFilmsById = async (actorId) => {
    try {
        const actor = await Actor.findOne({_id: actorId}).populate({
            path: 'movies.id',
            model: 'Film'
        });

        const sortedMovies = actor.movies
        .sort((a, b) => {
            // Calcul du score pour chaque film
            const scoreA = (a.id.vote_average * 2) + Math.log10(a.id.vote_count || 1) + (a.id.popularity / 10);
            const scoreB = (b.id.vote_average * 2) + Math.log10(b.id.vote_count || 1) + (b.id.popularity / 10);
    
            // Comparaison des scores
            return scoreB - scoreA; // Trier par score décroissant
        })
        .slice(0, 10); // Sélectionner les 10 premiers films
        if(!actor){
            throw new Error('Acteurs introuvable');
        }
        return {
            name: actor.name,
            films: sortedMovies.map(movie => movie.id) // Films complets
        };
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des films : ${error.message}`);
    }
}
    


module.exports = {
    getDirectorFilmsById,
    getActorFilmsById
};
