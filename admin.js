// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const STATUS = require('./user-status');
const config = require('./config');
const auth_token = require('./user-token');
const { get_users_from_file, update_users } = require('./db-interface/users-db-interface'); 

/////////////////////////////////////////////////////////////////////////////////

async function list_users( req, res) {
	let g_users = await get_users_from_file();
	g_users = g_users.map(user => { return {id: user.id, name: user.name, email: user.email, creation_date: user.creation_date, status: user.status}});
	res.json({g_users});
}

async function list_users_by_status(req, res) {
    const status = parseInt(req.params.status);
	let g_users = await get_users_from_file();
	g_users = g_users.filter(user => user.status === status);
	g_users = g_users.map(user => { return {id: user.id, name: user.name, email: user.email, status: user.status}});
	res.json({g_users});
}

async function update_status(req, res, from_status, to_status) {
    const id = parseInt( req.params.id );
	let g_users = await get_users_from_file();

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given");
		return;
	}

	let user = g_users.find( user =>  user.id === id )
	if (!user) {
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user");
		return;
	}

    if (user.status !== from_status) {
        res.status( StatusCodes.NOT_FOUND );
		res.send("ERROR")
		return;
    }

    if (req.user.id !== config.adminUser.id){
		res.status( StatusCodes.NOT_FOUND);
		res.send("Not authorized");
		return;
	}

    user.status = to_status;
    await update_users(g_users);
	user = {id: user.id, name: user.name, email: user.email, status: user.status};
    res.json(user);
}

/////////////////////////////////////////////////////////////////////////////////
const router = express.Router();

router.get('/users', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { list_users(req, res )  } )
router.get('/users_status/(:status)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { list_users_by_status(req, res )  } )
router.put('/approve/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { update_status(req, res, STATUS.created, STATUS.active) } )
router.put('/suspend/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { update_status(req, res, STATUS.active, STATUS.suspended) } )
router.put('/restore/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { update_status(req, res, STATUS.suspended, STATUS.active) } )
router.put('/delete/(:id)', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { update_status(req, res, STATUS.active, STATUS.deleted) } )

module.exports = router;