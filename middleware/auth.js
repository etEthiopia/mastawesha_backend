const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    //console.log(req);
    const token = req.get('xauthtoken');
    // Check for token
    try {
        const decoded = jwt.verify(token, process.env.KEY, {
            algorithm: 'HS256'
        });

        req.user = decoded;
        next();
    } catch {
        res.status(401);
        res.send.json({
            message: "Bad Token",
            success: false
        });
    }


}

module.exports = auth;