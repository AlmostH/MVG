const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');


// POST => Création de compte
exports.signup = (req, res, next) => {

    if (!validator.validate(req.body.email) || req.body.password.length < 8) {
        console.log('Inscription impossible : email ou mot de passe invalide');
        return res.status(400).json({ message: 'Inscription impossible : email ou mot de passe invalide' });
      }
    // Appel de la fonction de hachage de bcrypt dans le MDP (qui est "salé" 10 fois)
    bcrypt.hash(req.body.password, 10)
    // Utilisation du hash pour créer un utilisateur
      .then(hash => {
        // Création d'une instance du modèle User
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Enregistrement dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// POST => Connexion
exports.login = (req, res, next) => {
    // Vérification de l'existence de l'utilisateur dans notre base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message:'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe entré avec le hash de la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' });
                    }
                    // Si les informations sont valides, nous renvoyons une réponse contenant userId et un token crypté
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};