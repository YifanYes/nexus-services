const express = require('express');
const checkToken = require('../middlewares/checkToken.middleware');
const guildsController = require('../controllers/guilds.controllers');
const router = express.Router();

router.get('/:guildId', guildsController.getGuild);
router.post('/', guildsController.foundGuild);

module.exports = router;
