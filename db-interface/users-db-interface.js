const fsSync = require('fs');
const fs = fsSync.promises;
const config = require('../config');
const usersPath = config.usersPath;

async function get_users_from_file () {
    let g_users;

	if (fsSync.existsSync(usersPath)) {
		g_users = await fs.readFile(usersPath, {encoding:'utf8', flag:'r'});
		g_users = JSON.parse(g_users);
		g_users = g_users.g_users;
    }

    return g_users;
}

async function get_user_status_by_id(id) {
    let g_users = await get_users_from_file();
    const user = g_users.find( user =>  user.id == id );

    return user ? user.status : user;
}

async function get_user_by_id(id) {
    let g_users = await get_users_from_file();

    return g_users.find( user =>  user.id == id );
}

async function update_users(g_users) {
	await fs.writeFile(usersPath, JSON.stringify({g_users}));
}

module.exports = {
    get_users_from_file,
    get_user_status_by_id,
    get_user_by_id,
    update_users
}