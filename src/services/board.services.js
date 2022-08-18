const prisma = require('../config/database');

const createBoard = (name, guildId) => {
    return prisma.board.create({
        data: {
            name,
            guildId,
            columns: {
                // Create default columns specified in the metholodogy
                create: [
                    { name: 'Fundación', orderInBoard: 0 },
                    { name: 'Misiones en espera', orderInBoard: 1 },
                    { name: 'Misiones en curso', orderInBoard: 2 },
                    { name: 'Emboscadas', orderInBoard: 3 },
                    { name: 'Misiones terminadas', orderInBoard: 4 },
                    { name: 'Reviews', orderInBoard: 5 },
                    { name: 'Raid de equipo', orderInBoard: 6 }
                ]
            }
        },
        include: {
            columns: true // Include all columns in the returned object
        }
    });
};

module.exports = {
    createBoard
};
