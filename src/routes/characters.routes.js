const express = require('express');
const checkToken = require('../middlewares/checkToken.middleware');
const charactersController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/', charactersController.characterRegister);
router.post('/login', charactersController.characterLogin);
router.get('/:characterId', charactersController.getCharacter);
router.patch('/:characterId', charactersController.editCharacter);

module.exports = router;
