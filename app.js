const express = require('express');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');

// connexion à la base de données
mongoose.connect('mongodb+srv://MonVieuxGrimoire:w53IEU1EGXcIDonr@cluster0.srwo35g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //création de l'application
const app = express();

// Middleware permettant à Express d'extraire le corps JSON des requêtes POST
app.use(express.json());
app.use('/api/books', booksRoutes);

// Middleware gérant les erreurs de CORS
app.use((req, res, next) => {
  // Accès à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Autorisation d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


module.exports = app;
