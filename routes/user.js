const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
// =>POST Création de compte
router.post('/signup', userCtrl.signup);
//=> POST Connexion
router.post('/login', userCtrl.login);

module.exports = router;