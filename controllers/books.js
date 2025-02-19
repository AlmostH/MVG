const Book = require('../models/Book');
//donne accès aux fonctions qui nous permettent de modifier le système de fichiers
const fs = require('fs');

// AJOUT D'UN NOUVEAU LIVRE
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    //Suppression de l'id pour génération d'un nouvel id unique par MongoDB
    delete bookObject._id;
    // Suppression du userId pour associer le livre à l'userId authentifié
    delete bookObject._userId;
      /* création nouvelle instance du modèle Book 
      combine les propriétés de bookObject avec l'ID de l'utilisateur et l'URL de l'image*/
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistrement du livre dans la base de données
    book.save()
      .then(() => res.status(201).json({ message: 'livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  }


// MODIFICATION D'UN LIVRE
  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                // Séparation du nom du fichier image existant
                const filename = book.imageUrl.split('/images/')[1];
                // Si l'image a été modifiée, on supprime l'ancienne
                req.file && fs.unlink(`images/${filename}`, (err => {
                        if (err) console.log(err);
                    })
                );
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };


// SUPPRESSION D'UN LIVRE
 exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
// RÉCUPÉRATION D'UN LIVRE SELON ID
  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  }
// RÉCUPÉRATION DE TOUS LES LIVRES
  exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  }

  // NOTATION D'UN LIVRE
  exports.ratingBook = (req, res, next) => {
    // On extrait les valeurs userId et rating du corps de la requête
    const { userId, rating } = req.body;
  
    // Vérifier que la note est comprise entre 0 et 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }
  
    // Puis on recherche dans les données le livre avec l'ID fourni dans les paramètres de la requête
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // Vérifier si l'utilisateur a déjà noté ce livre
        const userAlreadyRating = book.ratings.find((r) => r.userId === userId);
        if (userAlreadyRating) {
          return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
        }
  
        // Puis on ajoute la nouvelle note au tableau "ratings"
        book.ratings.push({ userId, grade: rating });
  
        // Puis on met à jour la note moyenne "averageRating"
        const totalRatings = book.ratings.length;
        // sum= accumulateur booklist= current value.ajoute la valeur de l'élément actuel à la somme déjà calculée des valeurs précédentes.
        const sumRatings = book.ratings.reduce((sum, booklist) => sum + booklist.grade, 0); //  un argument final (0) qui représente la valeur initiale de sum
        const newAverageRating = sumRatings / totalRatings;

        book.averageRating = parseFloat(newAverageRating.toFixed(2)); // parseFloat converti string en number & toFixed(2) limite à deux decimales
  
        // Sauvegarder les modifications _ Promesse renvoyant le livre mis à jour
        return book.save()
          .then((updatedBook) => res.status(200).json(updatedBook))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };

  // RÉCUPÉRATION DES 3 LIVRES LES MIEUX NOTÉS
exports.getBestBooks = (req, res, next) => {
    // recherche dans tous les livres
    // trie les résultats en fonction de la propriété averageRating par ordre décroissant (avererageRating:-1) donc les mieux notés en premier
    // limité à 3 résultats
    Book.find().sort({ averageRating: -1 }).limit(3)
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
  };