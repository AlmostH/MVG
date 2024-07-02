const express = require('express');

const router = express.Router();
const Book = require('../models/Book');

// POST => Enregistrement d'un livre
router.post('/', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });
  
  // GET => Récupération de tous les livres
    router.get('/', (req, res, next) => {
      Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
    });
  // GET => Récupération d'un livre spécifique
    router.get('/:id', (req, res, next) => {
      Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
    });
  // PUT => Modification d'un livre existant
    router.put('/:id', (req, res, next) => {
      Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    });
    // DELETE => Suppression d'un livre
    router.delete('/:id', (req, res, next) => {
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });

module.exports = router;