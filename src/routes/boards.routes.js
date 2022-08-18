const express = require('express');
const boardsController = require('../controllers/boards.controller');
const router = express.Router();

router.post('/', boardsController.initializeBoard);
router.get('/:boardId', boardsController.getBoard);

module.exports = router;
