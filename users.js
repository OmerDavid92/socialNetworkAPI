// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const STATUS = require('./user-status');
const config = require('./config');
const jwt = require('jsonwebtoken');
const auth_token = require('./user-token');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
const { get_users_from_file, update_users } = require('./db-interface/users-db-interface');

// API functions
function get_version(req, res) {
	const version_obj = { version: package.version, description: package.description };
	res.send(JSON.stringify( version_obj));   
}

async function login(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	let g_users = await get_users_from_file();
	const user = g_users.find(user => user.email === email);
	const { enc_password } = user ? enc_pass(password, user.salt) : { enc_password: null };

	if (!user || user.password !== enc_password) {
		res.json({ err: "Wrong email or password" });
		return;
	}

	if (user.status !== STATUS.active) {
		res.json({ err: "Not an active user" });
		return;
	}

	const token = jwt.sign(user, process.env.ACCESS_TOKEN);
	const isAdmin = user.isAdmin;
	res.json({ token, isAdmin });
}

async function get_user(req, res) {
	const id =  parseInt( req.params.id );
	let g_users = await get_users_from_file();

	if ( id <= 0) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const user = g_users.find(user =>  user.id == id )
	if (!user) {
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	if (req.user.id !== id) {
		res.status( StatusCodes.UNAUTHORIZED);
		res.send("Not authorized");
		return;
	}

	user = {id: user.id, name: user.name, email: user.email, status: user.status};
	res.json(user);   
}


async function delete_user( req, res ) {
	const id =  parseInt( req.params.id );
	let deleted_user;
	let g_users = await get_users_from_file();

	if ( id <= 0)
	{
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Bad id given")
		return;
	}

	if ( id == 1)
	{
		res.status(StatusCodes.FORBIDDEN);
		res.send("Can't delete root user")
		return;		
	}

	const idx = g_users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status(StatusCodes.NOT_FOUND);
		res.send( "No such user")
		return;
	}

	if (req.user.id !== id){
		res.status(StatusCodes.UNAUTHORIZED);
		res.send("Not authorized");
		return;
	}

	deleted_user = g_users.splice( idx, 1 );
	await update_users(g_users);
	deleted_user = {id: deleted_user.id, name: deleted_user.name, email: deleted_user.email, status: deleted_user.status};
	res.json(deleted_user);   
}

function enc_pass(password, salt = crypto.randomBytes(16).toString('hex')) {
	const enc_password = cryptojs.SHA256(password.toString() + salt.toString()).toString();

	return { enc_password, salt };
}

async function create_user(req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	let g_users = await get_users_from_file();
	let isEmailExists = g_users.some(user => user.email === email);
	
	if ( !name || !email || !password) {
		res.status(StatusCodes.BAD_REQUEST);
		return res.send("Missing data in request");
	}

	if(isEmailExists) {
		return res.send("This username or email is already exists");
	}

	const { enc_password, salt } = enc_pass(password);
	let max_id = 0;
	g_users.forEach(item => { max_id = Math.max( max_id, item.id) });

	const new_id = max_id + 1;
	let creation_date = new Date();
	let new_user = { id: new_id , name, email, password: enc_password, salt, creation_date, status: STATUS.created, isAdmin: 'false'};
	
	g_users.push(new_user);
	await update_users(g_users);
	new_user = {id: new_user.id, name: new_user.name, email: new_user.email, status: new_user.status};
	res.json(new_user);
}

async function update_user( req, res ) {
	const id =  parseInt( req.params.id );
	let g_users = await get_users_from_file();

	if (id <= 0) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const idx = g_users.findIndex(user =>  user.id === id);

	if (idx < 0) {
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

	if (req.user.id !== id){
		res.status(StatusCodes.UNAUTHORIZED);
		res.send("Not authorized");
		return;
	}
		
	await update_users(g_users);
	user = {id: user.id, name: user.name, email: user.email, status: user.status};
	res.json({user});   
}

// Routing
const router = express.Router();

router.post('/login', (req, res) => { login(req, res )  } )
router.get('/version', (req, res) => { get_version(req, res )  } )
router.post('/users', (req, res) => { create_user(req, res )  } )
router.put('/user/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { update_user(req, res )  } )
router.get('/user/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { get_user(req, res )  })
router.delete('/user/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { delete_user(req, res )  })

module.exports = router;