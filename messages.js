const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const STATUS = require('./user-status');
const config = require('./config');
const auth_token = require('./user-token');
const { get_users_from_file, get_user_status_by_id, get_user_by_id } = require('./db-interface/users-db-interface');
const { get_messages_from_file, update_messages } = require('./db-interface/messages-db-interface');

/////////////////////////////////////////////////////////////////

async function list_messages( req, res) {
    let g_messages = await get_messages_from_file();
    g_messages = g_messages.filter(message => message.send_to === req.user.id);
    g_messages = await Promise.all(g_messages.map(async (message) => {
        let user = await get_user_by_id(message.send_from);
        message.send_from = user.name;
        user = await get_user_by_id(message.send_to);
        message.send_to = user.name;
        return message;
    }));
    res.json({ g_messages });
    
}

async function create_message(req, res) {
    const text = req.body.text;
    const send_to = parseInt(req.body.send_to);
    let g_messages = await get_messages_from_file();
    
    if ( !text ) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
    }

    if (req.user !== STATUS.active &&
        (await get_user_status_by_id(send_to) !== STATUS.active)) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send("Not an active user");
        return;
    }

    // Find max id 
	let max_id = 0;
	g_messages.forEach(item => { max_id = Math.max( max_id, item.id) });

	const new_id = max_id + 1;
	let creation_date = new Date();
    const new_message = { id: new_id, text, creation_date, send_from: req.user.id, send_to };
	
	g_messages.push(new_message);
    await update_messages(g_messages);
	res.json(new_message);   
}

async function send_to_all(req, res ) {
    let g_users = await get_users_from_file();
    let g_messages = await get_messages_from_file();
    const text = req.body.text;
    let g_users_length = g_users.length;
    let message_array = [];
    let new_message;
    let creation_date;
    let new_id;
    let max_id;

    if (!text) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
    }
    
    if (req.user.id !== config.adminUser.id) {
        res.status( StatusCodes.UNAUTHORIZED);
		res.send("Not authorized");
        return;
    }

    max_id = 0;
    g_messages.forEach(item => { max_id = Math.max( max_id, item.id) });

    for (let i=0; i<g_users_length; i++){
        new_id = max_id++;
    	creation_date = new Date();
    	new_message = { id: new_id , text, creation_date, send_from: config.adminUser.id, send_to: g_users[i].id};
	
    	g_messages.push(new_message);
        message_array[i] = new_message;
    }

    await update_messages(g_messages);
    res.json({message_array});  
}

/////////////////////////////////////////////////////////////////

const router = express.Router();

router.post('/message', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { create_message(req, res )  } )
router.post('/messages', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { send_to_all(req, res )  } )
router.get('/getMessages', (req, res, nex) => { auth_token(req, res, nex) }, (req, res) => { list_messages(req, res )  } )


module.exports = router;