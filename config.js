let config = {
    port: 5000,
    usersPath: 'users.json',
    postsPath: 'posts.json',
    messagesPath: 'messages.json',
    adminUser: {
        id: 1,
        name: 'Root',
        email: 'root@gmail.com',
        password: '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e',
        salt: '123',
        status: 'active',
        realPass: '123',
        isAdmin: 'true'
    }
}

module.exports = config;