const express = require('express');
const checkToken = require('../middlewares/checkToken.middleware');
const missionsController = require('../controllers/characters.controllers');
const router = express.Router();

router.post('/add', checkToken, missionsController.addNewMission);

module.exports = router;
