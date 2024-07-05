const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


const bookCtrl = require('../controllers/books');


// POST => Enregistrement d'un livre
router.post('/',bookCtrl.createBook );
  
  // GET => Récupération de tous les livres
    router.get('/', auth, bookCtrl.getAllBooks);
  // GET => Récupération d'un livre spécifique
    router.get('/:id', auth, bookCtrl.getOneBook);
  // PUT => Modification d'un livre existant
    router.put('/:id', auth, bookCtrl.modifyBook);
    // DELETE => Suppression d'un livre
    router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;