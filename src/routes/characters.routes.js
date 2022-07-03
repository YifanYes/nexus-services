const express = require('express');
const checkToken = require('../middlewares/checkToken.middleware');
const characterController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/create', characterController.characterRegister);
router.post('/login', characterController.characterLogin);
router.get('/me', checkToken, characterController.getMe);

module.exports = router;