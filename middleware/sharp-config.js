const sharp = require('sharp');
// gerer les fichiers
const fs = require('fs');

const resizeImage = (req, res, next) => {
// On vérifie si un fichier a été téléchargé
  if (!req.file) {
    return next();
  }


  sharp(req.file.path)
    .resize({ width: 500})
    .toFormat('webp')
    .toFile(req.file.path.replace(/\.(jpg|jpeg|png)$/, '.webp'))

    .then(() => {
     
      req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
      // Remplacer le fichier original par le fichier redimensionné
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting original file:', err);
        }
        next();
      });
    })
    .catch((error) => {
      console.error('Image processing error:', error);
      next();
    });
};

module.exports = resizeImage;