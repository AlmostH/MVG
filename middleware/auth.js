const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    // Extraction du token du header Authorization de la requête
       const token = req.headers.authorization.split(' ')[1]; 
       // Décodage du token
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        // Extraction de l'ID de l'utilisateur qui est maintenant authentifié
       const userId = decodedToken.userId;
       req.auth = { // Ajoute les information d'authentification à l'objet request
           userId: userId
       };
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};