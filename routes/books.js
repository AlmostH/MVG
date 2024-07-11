const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeImage = require('../middleware/sharp-config');

const bookCtrl = require('../controllers/books');


  // GET => Récupération de tous les livres
    router.get('/', bookCtrl.getAllBooks);  
 // GET=> Récupération des 3 livres les mieux notés 
    router.get('/bestrating', bookCtrl.getBestBooks);
  // GET => Récupération d'un livre spécifique
    router.get('/:id', bookCtrl.getOneBook);
   // POST => Enregistrement d'un livre
   router.post('/', auth, multer, resizeImage, bookCtrl.createBook );
  //POST => Ajout d'une note à un livre
   router.post('/:id/rating', auth, bookCtrl.ratingBook);
  // PUT => Modification d'un livre existant
    router.put('/:id', auth, multer, resizeImage, bookCtrl.modifyBook);
    // DELETE => Suppression d'un livre
    router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;