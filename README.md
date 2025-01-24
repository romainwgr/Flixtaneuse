
## Configuration

1. le fichier .env contient les informations de configurations du projet avec :
      - `MONGO_URI` : La chaîne de connexion MongoDB.
      - `JWT_SECRET` : La clé du token json web token pour gérer l'authentification des utilisateurs
      - `PORT` : Le port sur lequel le serveur va tourner (par défaut, 3000).

2. Pour lancer le projet:
Sur le dossier backend :
   - npm install
   - npm start

le dossier backend permet de créer une api utilisable dans le front end qui permet de faire des opérations sur la base de données (CRUD)

Sur le dossier frontend :
   - npm install
   - npm run serve

