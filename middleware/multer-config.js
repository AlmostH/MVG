const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Enregistrement des fichiers dans le dossier images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
     // Définit nom du fichier : nom original+ espace remplacé par underscore + horodatage
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
// Gestion des téléchargements de fichiers image uniquement
module.exports = multer({storage: storage}).single('image');