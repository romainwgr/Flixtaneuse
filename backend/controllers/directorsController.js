// backend/controllers/directorsController.js
const Director = require('../models/Director');
const Film = require('../models/Film');
const { getDirectorFilmsById } = require('./utils/utils.js'); // Importez la fonction utilitaire




const getFamousDirectorsFilms = async (req, res) => {
  const directorIds = [
      424, 1507, 21, 16, 723, 619, 629, 350, 91, 242, 229, 104, 52, 479, 1949, 419, 58, 2516, 160
  ];

  try {
      // Sélectionner 5 IDs de réalisateurs au hasard
      const selectedIds = directorIds
          .sort(() => Math.random() - 0.5) // Mélange aléatoire
          .slice(0, 5); // Prendre les 5 premiers

          // Récupérer les informations des réalisateurs sélectionnés avec leurs films
      const results = await Promise.all(
          selectedIds.map(async (id) => {
              return await getDirectorFilmsById(id);
          })
      );

      // Envoyer le résultat au client
      res.status(200).json(results);
  } catch (error) {
      console.error("Erreur lors de la récupération des films des réalisateurs célèbres :", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération des films." });
  }
};




// Rechercher un réalisateur par nom
const searchDirectorByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Le paramètre 'name' est requis." });
    }

    const directors = await Director.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json(directors);
  } catch (error) {
    console.error("Erreur lors de la recherche des réalisateurs :", error);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

const getDirectorById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Récupérer le réalisateur
      const director = await Director.findById(id);
      if (!director) {
        return res.status(404).json({ message: "Réalisateur non trouvé." });
      }
  
      // Récupérer les films basés sur les IDs numériques
    //   const movies = await Film.find({ id: { $in: director.movies } });
  
      res.status(200).json({
        director: {
          id: director._id,
          name: director.name,
        },
        // movies, // Détails des films
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du réalisateur :", error);
      res.status(500).json({ message: "Une erreur est survenue." });
    }
  };
  
 

  

module.exports = {
  searchDirectorByName,
  getDirectorById,
  getFamousDirectorsFilms
};
