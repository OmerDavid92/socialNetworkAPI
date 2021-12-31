let config = {
    port: 5001,
    usersPath: 'users.json',
    postsPath: 'posts.json',
    massagesPath: 'massages.json',
    adminUser: {
        id: 1,
        name: 'Root',
        password: '123',
        salt: '123',
        status: 'active'
    }
}

module.exports = config;