const express = require('express');
const missionsController = require('../controllers/missions.controllers');
const router = express.Router();

router.post('/add', missionsController.addNewMission);
router.patch('/finish', missionsController.finishMission);

module.exports = router;
