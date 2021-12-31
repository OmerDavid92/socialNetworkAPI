const fsSync = require('fs');
const fs = fsSync.promises;
const config = require('../config');

const messagesPath = config.messagesPath;

async function get_messages_from_file (){
	let g_messages = [];

	if (fsSync.existsSync(messagesPath)) {
		g_messages = await fs.readFile(messagesPath, {encoding:'utf8', flag:'r'});
		g_messages = JSON.parse(g_messages);
		g_messages = g_messages.g_messages;
	}

    return g_messages;
}

async function update_messages(g_messages) {
	await fs.writeFile(messagesPath, JSON.stringify({g_messages}));
}

module.exports = {
    get_messages_from_file,
	update_messages
}