const mongoose = require('mongoose');
const Film = require('../../models/Film');
const Actor = require('../../models/Actor');
const Director = require('../../models/Director');
const Keyword = require('../../models/Keyword');
const User = require('../../models/User');
const { performance } = require('perf_hooks');
// const fs = require('fs');


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

  // Avec promise all et avec index
  const [directors, actors, filmsByTitle, keywords, filmsByGenre] = await Promise.all([
    Director.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ name: 1 }),
    Actor.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ name: 1 }),
    Film.find({ title: { $regex: searchTerm, $options: 'i' } }).hint({ title: 1 }),
    Keyword.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ name: 1 }),
    Film.find({ 'genres.name': { $regex: searchTerm, $options: 'i' } }).hint('idx_genres_name')
  ]);
  // Sans promise.all() pour comparer les perfs
  // const directors = await Director.find({ name: { $regex: searchTerm, $options: 'i' } });
  // const actors = await Actor.find({ name: { $regex: searchTerm, $options: 'i' } });
  // const filmsByTitle = await Film.find({ title: { $regex: searchTerm, $options: 'i' } });
  // const keywords = await Keyword.find({ name: { $regex: searchTerm, $options: 'i' } });
  // const filmsByGenre = await Film.find({ 'genres.name': { $regex: searchTerm, $options: 'i' } });
  
  // avec promise all sans index
  // const [directors, actors, filmsByTitle, keywords, filmsByGenre] = await Promise.all([
  //   Director.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 }),
  //   Actor.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 }),
  //   Film.find({ title: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 }),
  //   Keyword.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 }),
  //   Film.find({ 'genres.name': { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 })
  // ]);
  
  // Sans promise all et sans index 
  //  const directors = await Director.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 });
  //  const actors = await Actor.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 });
  //  const filmsByTitle = await Film.find({ title: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 });
  //  const keywords = await Keyword.find({ name: { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 });
  //  const filmsByGenre = await Film.find({ 'genres.name': { $regex: searchTerm, $options: 'i' } }).hint({ $natural: 1 });


  // console.log(`Résultats trouvés - 
  //   Réalisateurs: ${directors.length}, 
  //   Acteurs: ${actors.length}, 
  //   Titres: ${filmsByTitle.length}, 
  //   Mots-clés: ${keywords.length}, 
  //   Genres: ${filmsByGenre.length}`);

  //   // Nombre de réalisateurs, acteurs, titres, mots clés, et genre par recherche
  //  const searchResults = { 
  //     réalisateurs: directors.length, 
  //   acteurs: actors.length, 
  //   titres: filmsByTitle.length, 
  //   mots_clés: keywords.length, 
  //   genres: filmsByGenre.length
  //   }
  // Traitement des keywords avec sécurité
  keywords.forEach(k => {
    k.movies?.forEach(m => { // Ajout de l'opérateur optionnel
      const id = getMovieId(m?._id || m?.id || m);
      id && filmIds.add(id);
    });
  });

  // Traitement générique des collections
  const processCollection = (items, type) => {
    console.log(`Traitement des ${type} (${items.length})`);
    items.forEach(item => {
      item.movies?.forEach(m => { // Sécurité supplémentaire
        const id = getMovieId(m?.id || m);
        id && filmIds.add(id);
      });
    });
  };

  processCollection(directors, 'réalisateurs');
  processCollection(actors, 'acteurs');

  // Ajout des films directs
  filmsByTitle.forEach(f => filmIds.add(f?._id));
  filmsByGenre.forEach(f => filmIds.add(f?._id));

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`Collecte terminée en ${duration} ms (${filmIds.size} films trouvés)`);
  
  return { 
    ids: Array.from(filmIds).map(id => new mongoose.Types.ObjectId(id)), 
    duration 
  };
};

// Applique les préférences avec gestion des données manquantes
const applyPreferences = async (films, preferences, searchTerm) => {
  const PREFERENCE_WEIGHT = 100;
  const startTime = performance.now();

  // Vérification de la présence des préférences
  if (!preferences) {
    throw new Error("La fonction applyPreferences ne doit être appelée que si des préférences sont présentes.");
  }

  // Sécurité pour accéder aux données des films
  const safeAccess = (film, field) => 
    film[field]?.filter(Boolean) || []; // Filtrer les valeurs nulles

  // Récupération des mots-clés liés aux films
  const keywords = await Keyword.find({ 
    movies: { $in: films.map(f => f._id) } 
  });

  // Création d'une map pour les mots-clés liés aux films
  const keywordMap = keywords.reduce((acc, keyword) => {
    keyword.movies?.forEach(movieId => {
      const idStr = movieId?.toString();
      if (idStr) {
        acc.set(idStr, [...(acc.get(idStr) || []), keyword._id.toString()]);
      }
    });
    return acc;
  }, new Map());

  // Traitement des films avec les préférences
  const processedFilms = films.map(film => {
    let totalBoost = 0;

    // Calcul des préférences par catégorie
    const processCategory = (items, type) => (items || []).reduce((boost, item) => {
      const itemKey = String(item?.id || item?._id);
      return boost + ((preferences[type]?.[itemKey] || 0) * PREFERENCE_WEIGHT);
    }, 0);

    // Application des préférences sur chaque catégorie
    totalBoost += processCategory(safeAccess(film, 'genres'), 'genres');
    totalBoost += processCategory(
      safeAccess(film, 'actors').map(id => ({ id })), 
      'actors'
    );
    totalBoost += processCategory(
      safeAccess(film, 'directors').map(id => ({ id })), 
      'directors'
    );

    // Application des préférences sur les mots-clés associés
    const filmKeywords = keywordMap.get(film._id?.toString()) || [];
    totalBoost += processCategory(filmKeywords, 'keywords');

    // Retourne le film avec un score mis à jour
    return {
      ...film,
      score: (film.vote_count || 0) + totalBoost
    };
  });

  // Renvoie les films triés par score décroissant et la durée d'exécution
  return {
    films: processedFilms.sort((a, b) => b.score - a.score),
    duration: (performance.now() - startTime).toFixed(2)
  };
};


// const exportToJson = (data, fileName = 'results.json') => {
//   fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
//   console.log(`✓ Données exportées dans ${fileName}`);
// };

const searchFilmByTitle = async (req, res) => {
  try {
    const { title, limit = 14 } = req.query;
    const user = req.user;

    if (!title) return res.status(400).json({ error: "Terme de recherche requis" });

    const overallStartTime = performance.now();

    // Récupération des préférences utilisateur si connecté
    let preferences = null;
    if (user) {
      const userDoc = await User.findById(user.id).select("preferences").lean();
      preferences = userDoc?.preferences;
      console.log(`Préférences utilisateur récupérées: ${preferences ? 'oui' : 'non'}`);
    }

    // Phase 1 : Collecte des IDs de films
    const { ids: filmIdsArray, duration: collectDuration } = await collectFilmIds(title);
    console.log(`Nombre total de films collectés: ${filmIdsArray.length}`);

    // Phase 2 : Récupération des films
    const startGetFilms = performance.now();

    let films = await Film.find({ _id: { $in: filmIdsArray } })
      .sort({ vote_count: -1, title: 1 })
      .limit(Number(limit) + 1) // Limite + 1 pour vérifier "hasMore"
      .lean();
      const totalGetFilms = (performance.now() - startGetFilms).toFixed(2);


    let processedFilms = films; // Films à retourner après traitement
    let preferenceDuration = 0;

    // Si l'utilisateur a des préférences, on les applique
    if (preferences) {
      console.log('Utilisateur connecté avec préférences, application des préférences.');
      const preferenceStart = performance.now();

      // Application des préférences
      const { films: scoredFilms } = await applyPreferences(films, preferences);
      processedFilms = scoredFilms;

      preferenceDuration = (performance.now() - preferenceStart).toFixed(2);

      console.log('Tri des films par score final après application des préférences.');
    } else {
      console.log('Utilisateur non connecté ou sans préférences. Tri par popularité.');
      processedFilms = films.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }

    // Pagination et contrôle de "hasMore"
    const hasMore = processedFilms.length > limit;
    const finalFilms = hasMore ? processedFilms.slice(0, limit) : processedFilms;

    // Calcul du temps total
    const overallEndTime = performance.now();
    const overallDuration = (overallEndTime - overallStartTime).toFixed(2);

    console.log(`Temps total de traitement: ${overallDuration} ms`);

    // Export des données pour analyse
    // const dataToExport = {
    //   searchTerm: title,
    //   userConnected: !!user,
    //   metrics: {
    //     fetchDuration: collectDuration,
    //     preferenceDuration: preferenceDuration,
    //     getFilmsDuration: totalGetFilms,
    //     totalDuration: overallDuration
    //   },
    //   results: {
    //     totalFilms: filmIdsArray.length,
    //     filmsWithPagination: finalFilms.length, // Nombre réel de films retournés avec pagination
    //   },
    //   scenarios: {
    //     promiseAll: false,
    //     pagination: true,
    //     title_length: title.length,
    //   }
    // };

    // exportToJson(dataToExport, `results_${title}_${Date.now()}.json`);

    // Envoi de la réponse
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