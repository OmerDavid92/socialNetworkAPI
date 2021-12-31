// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const fs = require('fs');
const STATUS = require('./user-status');
const config = require('./config');
const auth_token = require('./user-token');

const usersPath = config.usersPath;
const postsPath = config.postsPath;
const port = config.port;

// User's table
let g_users;
let g_posts = [];


/////////////////////////////////////////////////////////////////

function get_posts_from_file (){
	if (fs.existsSync(postsPath)){
		g_posts = fs.readFileSync(postsPath, {encoding:'utf8', flag:'r'});
		g_posts = JSON.parse(g_posts);
		g_posts = g_posts.g_posts;
	}
}


function get_users_from_file (){
	if (fs.existsSync(usersPath)){
		g_users = fs.readFileSync(usersPath, {encoding:'utf8', flag:'r'});
		g_users = JSON.parse(g_users);
		g_users = g_users.g_users;
	}
}

function list_posts( req, res) 
{
	get_posts_from_file();
	res.json({g_posts});
	
}


function get_user_status_by_id(id){
    get_users_from_file();
    const idx =  g_users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}
    const user = g_users[idx];
    return user.status;
}

function create_post(req, res) {

    const text = req.body.text;
    get_posts_from_file();
    
    
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
	
	g_posts.push( new_post  );
	fs.writeFileSync(postsPath, JSON.stringify({g_posts}));
	res.json(new_post);   
}

function delete_post(req, res) {
    const post_id = parseInt(req.params.id);
    get_posts_from_file();
    const idx =  g_posts.findIndex( post =>  post.id === post_id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such post")
		return;
	}
    const post_creator = g_posts[idx].creator_id;
   
    if (req.user.id !== post_creator && req.user.id !== config.adminUser.id) {
        res.status(StatusCodes.NOT_FOUND);
        res.send("No permissions")
        return;
    }

    let deleted_post = g_posts.splice( idx, 1 );
	fs.writeFileSync(postsPath, JSON.stringify({g_posts}));
	res.json({deleted_post});  
}


/////////////////////////////////////////////////////////////////


const router = express.Router();

router.post('/post', auth_token(req, res, nex), (req, res) => { create_post(req, res )  } )
router.get('/posts', auth_token(req, res, nex), (req, res) => { list_posts(req, res )  } )
router.delete('/post/(:id)', auth_token(req, res, nex),  (req, res) => { delete_post(req, res )  } )

module.exports = router;