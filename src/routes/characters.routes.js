const express = require('express');
const checkToken = require('../middlewares/checkToken.middleware');
const characterController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/', characterController.characterRegister);
router.post('/login', characterController.characterLogin);
router.get('/:characterId', characterController.getCharacter);
router.patch('/:characterId', characterController.editCharacter);

module.exports = router;
