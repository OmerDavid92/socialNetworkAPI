const jwt = require('jsonwebtoken');
const { get_user_by_id } = require('./db-interface/users-db-interface');

function auth_token(req, res, nex){
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];
    if(token === null ) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err,user) => {
        if(err) return res.sendStatus(403);        
        req.user = await get_user_by_id(user.id);
        if(!req.user) return res.sendStatus(401);
        //console.log({user: req.user});
        nex();
    })
}

module.exports = auth_token;