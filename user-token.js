const { is } = require('express/lib/request');
const jwt = require('jsonwebtoken');

function auth_token(req, res, nex){
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];
    if(token === null ) return res.sendStatus(401);

    jwt.verify(token, proccess.env.ACCWSS_TOKEN, (err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = auth_token;