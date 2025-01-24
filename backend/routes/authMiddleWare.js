const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    console.log('Dans le middleware'); // Debug
    const authHeader = req.headers.authorization; // Récupération du token dans les en-têtes

    if (!authHeader) {
        console.log('Accès non autorisé. Token manquant.'); // Debug
        return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
    }

    const token = authHeader.split(' ')[1]; // Extraction du token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les informations utilisateur dans `req.user`
        console.log('MiddleWare validé'); // Debug
        next();
    } catch (err) {
        console.log('Token invalide ou expiré :'); // Debug
        console.error("Token invalide ou expiré :", err);
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

const useUserPref = (req, res, next) => {
    // Récupération de l'en-tête Authorization
    const authHeader = req.headers.authorization;
  
    // Vérification si l'en-tête est présent
    if (!authHeader) {
      console.log("Pas d'en-tête Authorization !");
      req.user = null; // Définit l'utilisateur à null si pas d'en-tête
      return next(); // Passe au middleware suivant
    }
  
    // Extraction du token
    const token = authHeader.split(" ")[1];
  
    try {
      // Vérification et décodage du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Ajout des informations utilisateur à l'objet req
      req.user = decoded;
  
      // Appel de next pour continuer le traitement
      return next();
    } catch (err) {
      // En cas de token invalide/expiré ou de problème
      req.user = null; // Définit l'utilisateur à null en cas d'erreur
      return next();
    }
  };
  
module.exports = { isAuthenticated ,useUserPref  };