const mongoose = require('mongoose');
const Film = require('../../models/Film');
const Actor = require('../../models/Actor');
const Director = require('../../models/Director');
const Keyword = require('../../models/Keyword');
const User = require('../../models/User');
const { performance } = require('perf_hooks');

// Fonction utilitaire pour la conversion d'ID
const getMovieId = (ref) => {
  if (ref?.$oid) return new mongoose.Types.ObjectId(ref.$oid);
  if (ref instanceof mongoose.Types.ObjectId) return ref;
  return null;
};

// Collecte les IDs de films depuis différentes sources
const collectFilmIds = async (searchTerm) => {
  console.log(`Recherche pour le terme: "${searchTerm}"`);

  const startTime = performance.now();

  const filmIds = new Set();

  const [directors, actors, filmsByTitle, keywords, filmsByGenre] = await Promise.all([
    Director.find({ name: { $regex: searchTerm, $options: 'i' } }),
    Actor.find({ name: { $regex: searchTerm, $options: 'i' } }),
    Film.find({ title: { $regex: searchTerm, $options: 'i' } }),
    Keyword.find({ name: { $regex: searchTerm, $options: 'i' } }),
    Film.find({ 'genres.name': { $regex: searchTerm, $options: 'i' } })
  ]);

  console.log(`Nombre de réalisateurs trouvés: ${directors.length}`);
  console.log(`Nombre d'acteurs trouvés: ${actors.length}`);
  console.log(`Nombre de films trouvés par titre: ${filmsByTitle.length}`);
  console.log(`Nombre de mots-clés trouvés: ${keywords.length}`);
  console.log(`Nombre de films trouvés par genre: ${filmsByGenre.length}`);

  // Traitement des keywords
  keywords.forEach(k => {
    k.movies.forEach(m => {
      const id = getMovieId(m._id || m.id || m);
      if (id) filmIds.add(id);
    });
  });

  // Traitement des réalisateurs et acteurs
  const processCollection = (items, type) => {
    console.log(`Traitement des ${type} (${items.length})`);
    items.forEach(item => {
      item.movies.forEach(m => {
        const id = getMovieId(m.id || m);
        if (id) filmIds.add(id);
      });
    });
  };

  processCollection(directors, 'réalisateurs');
  processCollection(actors, 'acteurs');

  // Ajout des films trouvés par titre et genre
  filmsByTitle.forEach(f => filmIds.add(f._id));
  filmsByGenre.forEach(f => filmIds.add(f._id));

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  console.log(`Temps de collecte des IDs: ${duration} ms`);

  return { ids: Array.from(filmIds).map(id => new mongoose.Types.ObjectId(id)), duration };
};

// Applique les préférences utilisateur
const applyPreferences = async (films, preferences) => {
  const PREFERENCE_WEIGHT = 100;

  if (!preferences) return { films, duration: 0 };

  const startTime = performance.now();

  const filmIds = films.map(f => f._id);
  const keywords = await Keyword.find({ movies: { $in: filmIds } });

  console.log(`Nombre de mots-clés associés aux films: ${keywords.length}`);

  const keywordMap = keywords.reduce((acc, k) => {
    k.movies.forEach(movieId => {
      const idStr = movieId.toString();
      acc.set(idStr, [...(acc.get(idStr) || []), k._id.toString()]);
    });
    return acc;
  }, new Map());

  const processedFilms = films.map(film => {
    let totalBoost = 0;

    const processCategory = (items, type) => {
      console.log(`Traitement des ${type} pour le film "${film.title}"`);
      if (!items || !preferences[type]) return 0;

      return items.reduce((boost, item) => {
        const itemKey = String(item.id || item._id);
        const match = preferences[type][itemKey];
        if (match) {
          console.log(`  - Match trouvé pour ${type}: ${itemKey}, boost: ${match * PREFERENCE_WEIGHT}`);
        }
        return match ? boost + match * PREFERENCE_WEIGHT : boost;
      }, 0);
    };

    totalBoost += processCategory(film.genres, 'genres');
    totalBoost += processCategory(film.actors.map(id => ({ id })), 'actors');
    totalBoost += processCategory(film.directors.map(id => ({ id })), 'directors');
    const filmKeywords = keywordMap.get(film._id.toString()) || [];
    totalBoost += processCategory(filmKeywords.map(id => ({ _id: id })), 'keywords');

    const finalScore = (film.vote_count || 0) + totalBoost;
    console.log(`Score final pour "${film.title}": ${finalScore}`);

    return { ...film, score: finalScore };
  });

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  console.log(`Temps d'application des préférences: ${duration} ms`);

  return { films: processedFilms, duration };
};

// Contrôleur principal
const searchFilmByTitle = async (req, res) => {
  try {
    const { title, limit = 10 } = req.query;
    const user = req.user;

    if (!title) return res.status(400).json({ error: "Terme de recherche requis" });

    const overallStartTime = performance.now();

    let preferences = null;
    if (user) {
      const userDoc = await User.findById(user.id).select("preferences").lean();
      preferences = userDoc?.preferences;
      console.log(`Préférences utilisateur récupérées: ${preferences ? 'oui' : 'non'}`);
    }

    const { ids: filmIdsArray, duration: collectDuration } = await collectFilmIds(title);
    console.log(`Nombre total de films collectés: ${filmIdsArray.length}`);

    let films = await Film.find({ _id: { $in: filmIdsArray } })
      .sort({ vote_count: -1, title: 1 })
      .limit(Number(limit) + 1)
      .lean();

    console.log(`Nombre de films trouvés en base: ${films.length}`);

    const { films: processedFilms, duration: preferenceDuration } = await applyPreferences(films, preferences);

    if (preferences) {
      console.log('Tri des films par score final.');
      processedFilms.sort((a, b) => b.score - a.score);
    } else {
      console.log('Aucune préférence, tri par popularité (vote_count).');
    }

    const hasMore = processedFilms.length > limit;
    const finalFilms = hasMore ? processedFilms.slice(0, limit) : processedFilms;

    const overallEndTime = performance.now();
    const overallDuration = (overallEndTime - overallStartTime).toFixed(2);

    console.log('Films retournés avec détails:');
    finalFilms.forEach(film => {
      console.log(`  - ${film.title} (${film._id}), Score: ${film.score}`);
    });
    console.log(`Temps total de traitement: ${overallDuration} ms`);

    res.json({
      films: finalFilms,
      metrics: {
        totalDuration: overallDuration,
        collectDuration,
        preferenceDuration
      },
      hasMore
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};

module.exports = { searchFilmByTitle };
