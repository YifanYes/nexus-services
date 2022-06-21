const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const characterController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/signup', characterController.characterRegister);
router.post('/login', characterController.characterLogin);
router.get('/me', checkAuth, characterController.getMe);

module.exports = router;