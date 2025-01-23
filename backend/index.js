const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors'); // Importer cors Cross origin

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware pour interpréter les requêtes JSON
app.use(express.json());


// Connexion à MongoDB avec Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Atlas"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));


// Importer et utiliser les routes de l'API des films
const filmRoutes = require('./routes/films.js');
app.use('/api/films', filmRoutes);

const usersRoutes = require('./routes/users.js');
app.use('/api/users', usersRoutes);

const actorsRoutes = require('./routes/actors.js');
app.use('/api/actors', actorsRoutes);

const directorsRoutes = require('./routes/directors.js');
app.use('/api/directors', directorsRoutes);

const likesRoutes = require('./routes/likes.js');
app.use('/api/likes', likesRoutes);

const rechercheRoutes = require('./routes/recherche.js');
app.use('/api/recherche', rechercheRoutes)
// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de films !");
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
