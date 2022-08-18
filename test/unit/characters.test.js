const { createCharacter } = require('../../src/services/character.services');

test('Character can be registered', async () => {
    let character = { username: 'nexusUser', password: 'nexusUser' };

    await expect(UserService._registerNewUser(character)).resolves.toEqual({
        validated: true,
        reason: 'You have successfully registered !',
        user: {
            password: expect.anything(),
            username: 'nexusUser'
        }
    });
});
