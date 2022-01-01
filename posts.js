// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const STATUS = require('./user-status');
const config = require('./config');
const auth_token = require('./user-token');
const { get_posts_from_file, update_posts } = require('./db-interface/posts-db-interface'); 

/////////////////////////////////////////////////////////////////
async function list_posts( req, res) {
	let g_posts = await get_posts_from_file();
	res.json({g_posts});
}

async function create_post(req, res) {
    const text = req.body.text;
    let g_posts = await get_posts_from_file();
    
    if ( !text ) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
	}

    if (req.user.status !== STATUS.active) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Not an active user");
		return;
	}

	// Find max id 
	let max_id = 0;
	g_posts.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)

	const new_id = max_id + 1;
	let creation_date = new Date();
	const new_post = { id: new_id , text, creation_date, creator_id: req.user.id};
	
	g_posts.push(new_post);
	await update_posts(g_posts);
	res.json({id: new_id});   
}

async function delete_post(req, res) {
    const post_id = parseInt(req.params.id);
    let g_posts = await get_posts_from_file();
    const idx =  g_posts.findIndex( post =>  post.id === post_id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such post")
		return;
	}
    const post_creator = g_posts[idx].creator_id;
   
    if (req.user.id !== post_creator && req.user.id !== config.adminUser.id) {
        res.status(StatusCodes.FORBIDDEN);
        res.send("No permissions")
        return;
    }

    let deleted_post = g_posts.splice( idx, 1 );
	await update_posts(g_posts);
	res.json({deleted_post});  
}

/////////////////////////////////////////////////////////////////

const router = express.Router();

router.post('/post', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { create_post(req, res )  } )
router.get('/posts', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { list_posts(req, res )  } )
router.delete('/post/(:id)', (req, res, nex) => { auth_token(req, res, nex) },  (req, res) => { delete_post(req, res )  } )

module.exports = router;