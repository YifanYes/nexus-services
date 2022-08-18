const prisma = require('../config/database');
const { toJson } = require('../utils/math.utils');
const { createBoard } = require('../services/board.services');

const initializeBoard = async (req, res) => {
    // De donde saco el guildId?
    const board = await createBoard(req.body.name, guildId);

    if (!board) return res.status(400).json({ message: 'Something went wrong' });

    return res.status(201).json({
        message: 'Board created successfully',
        data: toJson(board)
    });
};

const getBoard = async (req, res) => {
    const board = await prisma.board.findUnique({
        where: {
            id: req.params.boardId
        }
    });

    if (!board) return res.status(404).json({ message: 'This board doesnt exists' });

    return res.status(201).json({
        data: toJson(board)
    });
};

module.exports = {
    initializeBoard,
    createBoard,
    getBoard
};
