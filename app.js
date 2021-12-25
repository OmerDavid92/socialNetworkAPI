const express = require('express');
const package = require('./package.json');
const config = require('./config');
const user_route = require('./users');
const admin_route = require('./admin');
const post_route = require('./posts');
const massage_route = require('./massages');

const app = express();
const usersPath = config.usersPath;
const port = config.port;

// General app settings
const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}

app.use( set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));

app.use('/api', user_route);
app.use('/admin', admin_route);
app.use('/api', post_route);
app.use('/api', massage_route);

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; })