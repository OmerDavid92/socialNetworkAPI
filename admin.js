// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const fs = require('fs');
const STATUS = require('./user-status');
const config = require('./config');

const usersPath = config.usersPath;
const port = config.port;
let g_users;

/////////////////////////////////////////////////////////////////////////////////
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


function update_status(req, res, from_status, to_status) {
    const id =  parseInt( req.params.id );
	get_users_from_file();

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const user =  g_users.find( user =>  user.id == id )
	if (!user)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

    if (user.status !== from_status){
        res.status( StatusCodes.NOT_FOUND );
		res.send( "ERROR")
		return;
    }

    user.status = to_status;
    fs.writeFileSync(usersPath, JSON.stringify({g_users}));
    res.send(JSON.stringify(user));
}


function massage(req, res){}
function massage_by_id(req, res){}
function delete_post(req, res){}


/////////////////////////////////////////////////////////////////////////////////
const router = express.Router();

router.get('/users', (req, res) => { list_users(req, res )  } )
router.put('/approve/(:id)', (req, res) => { update_status(req, res, STATUS.created, STATUS.active )  } )
router.put('/suspend/(:id)', (req, res) => { update_status(req, res, STATUS.active, STATUS.suspended )  } )
router.put('/restore/(:id)', (req, res) => { update_status(req, res, STATUS.suspended, STATUS.active )  } )
router.put('/delete/(:id)', (req, res) => { update_status(req, res, STATUS.active, STATUS.deleted )  } )
router.post('/massage', (req, res) => { massage(req, res )  })
router.post('/massage/(:id)', (req, res) => { massage_by_id(req, res )  })
router.delete('/deletePost/(:id)', (req, res) => { delete_post(req, res )  })

module.exports = router;