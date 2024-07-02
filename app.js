const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');

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
// POST => Enregistrement d'un livre
app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

// GET => Récupération de tous les livres
  app.get('/api/books', (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  });
// GET => Récupération d'un livre spécifique
  app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  });

module.exports = app;
