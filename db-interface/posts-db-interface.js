const fsSync = require('fs');
const fs = fsSync.promises;
const config = require('../config');

const postsPath = config.postsPath;

async function get_posts_from_file() {
    let g_posts = [];

	if (fsSync.existsSync(postsPath)) {
		g_posts = await fs.readFile(postsPath, {encoding:'utf8', flag:'r'});
		g_posts = JSON.parse(g_posts);
		g_posts = g_posts.g_posts;
	}

    return g_posts;
}

async function update_posts(g_posts) {
	await fs.writeFile(postsPath, JSON.stringify({g_posts}));
}

module.exports = {
    get_posts_from_file,
    update_posts
}