const express = require('express');
const charactersController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/', charactersController.characterRegister);
router.post('/login', charactersController.characterLogin);
router.get('/:characterId', charactersController.getCharacter);
router.get('/', charactersController.getAllCharacters);
router.patch('/:characterId', charactersController.editCharacter);
router.patch('/:characterId/class', charactersController.assignClass);

module.exports = router;
