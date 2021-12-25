// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const fs = require('fs');
const STATUS = require('./user-status');
const config = require('./config');

const usersPath = config.usersPath;
const port = config.port;

// User's table
let g_users = [ {id:1, name: 'Root'} ];
if (!fs.existsSync(usersPath)){
	fs.writeFileSync(usersPath, JSON.stringify({g_users}));
}

// API functions

// Version 
function get_version( req, res) 
{
	const version_obj = { version: package.version, description: package.description };
	res.send(  JSON.stringify( version_obj) );   
}

function get_users_from_file (){
	if (fs.existsSync(usersPath)){
		g_users = fs.readFileSync(usersPath, {encoding:'utf8', flag:'r'});
		g_users = JSON.parse(g_users);
		g_users = g_users.g_users;
	}
}

function list_users( req, res) 
{
	get_users_from_file();
	console.log({g_users});
	res.send(JSON.stringify({g_users}));
	
}

function get_user( req, res )
{
	const id =  parseInt( req.params.id );
	get_users_from_file();

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const user =  g_users.find( user =>  user.id == id )
	if ( !user)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	res.send(  JSON.stringify( user) );   
}

function delete_user( req, res )
{
	get_users_from_file();
	const id =  parseInt( req.params.id );
	let deleted_user;

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	if ( id == 1)
	{
		res.status( StatusCodes.FORBIDDEN ); // Forbidden
		res.send( "Can't delete root user")
		return;		
	}

	const idx =  g_users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	deleted_user = g_users.splice( idx, 1 );
	fs.writeFileSync(usersPath, JSON.stringify({g_users}));
	res.send(  JSON.stringify({deleted_user}));   
}

function create_user( req, res )
{
	get_users_from_file();
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	if ( !name || !email || !password) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
	}


	// Find max id 
	let max_id = 0;
	g_users.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)

	const new_id = max_id + 1;
	let creation_date = new Date();
	const new_user = { id: new_id , name, email, password, creation_date, status: STATUS.created};
	
	g_users.push( new_user  );
	fs.writeFileSync(usersPath, JSON.stringify({g_users}));
	res.send(  JSON.stringify( new_user) );   
}

function update_user( req, res )
{
	get_users_from_file();
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const idx =  g_users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	if ( !name || !email || !password )
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request")
		return;
	}

	const user = g_users[idx];
	user.name = name;
	user.email = email;
	user.password = password;

	fs.writeFileSync(usersPath, JSON.stringify({g_users}));
	res.send(  JSON.stringify( {user}) );   
}

// Routing
const router = express.Router();

router.get('/version', (req, res) => { get_version(req, res )  } )
router.post('/users', (req, res) => { create_user(req, res )  } )
router.put('/user/(:id)', (req, res) => { update_user(req, res )  } )
router.get('/user/(:id)', (req, res) => { get_user(req, res )  })
router.delete('/user/(:id)', (req, res) => { delete_user(req, res )  })

module.exports = router;