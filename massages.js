const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const fs = require('fs');
const STATUS = require('./user-status');
const config = require('./config');

const usersPath = config.usersPath;
const massagesPath = config.massagesPath;
const port = config.port;

// User's table
let g_users;
let g_massages = [];

/////////////////////////////////////////////////////////////////

function get_massages_from_file (){
	if (fs.existsSync(massagesPath)){
		g_massages = fs.readFileSync(massagesPath, {encoding:'utf8', flag:'r'});
		g_massages = JSON.parse(g_massages);
		g_massages = g_massages.g_massages;
	}
}


function get_users_from_file (){
	if (fs.existsSync(usersPath)){
		g_users = fs.readFileSync(usersPath, {encoding:'utf8', flag:'r'});
		g_users = JSON.parse(g_users);
		g_users = g_users.g_users;
	}
}

function list_massages( req, res) 
{
	get_massages_from_file();
	res.send(JSON.stringify({g_massages}));
	
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

function create_massage(req, res) {
    const text = req.body.text;
    const send_from = parseInt(req.body.send_from);
    const send_to = parseInt(req.body.send_to);
    
    
    if ( !text ) {
        console.log({text});
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
	}

    if (send_from!==1){
       if ((get_user_status_by_id(send_from) !== STATUS.active &&
        (get_user_status_by_id(send_to) !== STATUS.active))) {
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Not an active user");
		return;
       }
    }

    // Find max id 
	let max_id = 0;
	g_massages.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)

	const new_id = max_id + 1;
	let creation_date = new Date();
	const new_massage = { id: new_id , text, creation_date, send_from, send_to};
	
	g_massages.push( new_massage  );
	fs.writeFileSync(massagesPath, JSON.stringify({g_massages}));
	res.send(  JSON.stringify( new_massage) );   
}

function send_to_all(req, res ) {
    get_users_from_file();
    get_massages_from_file();
    const text = req.body.text;
    let g_users_length = g_users.length;
    let massage_array = [];
    let new_massage;
    let creation_date;
    let new_id;
    let max_id;

    if ( !text ) {
        console.log({text});
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing data in request");
		return;
	}

    for (let i=0; i<g_users_length; i++){
        max_id = 0;
        g_massages.forEach(
            item => { max_id = Math.max( max_id, item.id) }
        )
        new_id = max_id + 1;
    	creation_date = new Date();
    	new_massage = { id: new_id , text, creation_date, send_from: 1, send_to: g_users[i].id};
	
    	g_massages.push( new_massage  );
        massage_array[i] = new_massage;
    }

    fs.writeFileSync(massagesPath, JSON.stringify({g_massages}));
    res.send(  JSON.stringify( massage_array) );  

}


/////////////////////////////////////////////////////////////////


const router = express.Router();

router.post('/massage', (req, res) => { create_massage(req, res )  } )
router.post('/massages', (req, res) => { send_to_all(req, res )  } )


module.exports = router;