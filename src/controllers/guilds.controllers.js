const prisma = require('../config/database');

const getGuild = async (req, res) => {
    // Get guild and guild members data
    const guild = await prisma.guild.findUnique({
        where: { id: req.params.id },
        include: {
            characters: true
        }
    });

    return res.status(200).json({ data: guild });
};

const foundGuild = async (req, res) => {
    const { name, members } = req.body;

    if (!(name && members)) return res.status(401).json({ error: 'Missing fields' });

    const guild = await prisma.guild.create({ data: { name: name } });

    if (!guild) res.status(500).json({ message: 'Something went wrong' });

    return res.status(201).json({ message: 'Guild created successfully' });
};

module.exports = {
    getGuild,
    foundGuild
};
