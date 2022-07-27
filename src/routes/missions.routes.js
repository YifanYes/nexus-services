const express = require('express');
const missionsController = require('../controllers/missions.controllers');
const router = express.Router();

router.get('/:missionId', missionsController.getMission);
router.post('/', missionsController.addNewMission);
router.post('/:missionId', missionsController.assignMission);
router.patch('/:missionId/completed', missionsController.finishMission);

module.exports = router;
