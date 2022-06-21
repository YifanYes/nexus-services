test('User can be registered users', async () => {
    let user = { username: 'jestUser', password: 'jestUser' };

    await expect(UserService._registerNewUser(user)).resolves.toEqual({
        validated: true,
        reason: 'You have successfully registered !',
        user: {
            password: expect.anything(),
            username: 'jestUser'
        }
    });
})