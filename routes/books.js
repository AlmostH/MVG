const express = require('express');

const router = express.Router();
const bookCtrl = require('../controllers/books');


// POST => Enregistrement d'un livre
router.post('/',bookCtrl.createBook );
  
  // GET => Récupération de tous les livres
    router.get('/', bookCtrl.getAllBooks);
  // GET => Récupération d'un livre spécifique
    router.get('/:id', bookCtrl.getOneBook);
  // PUT => Modification d'un livre existant
    router.put('/:id', bookCtrl.modifyBook);
    // DELETE => Suppression d'un livre
    router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;