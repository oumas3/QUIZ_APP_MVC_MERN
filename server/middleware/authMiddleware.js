const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sorasorasoraaaa@@2145';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                req.session.destroy();
                return res.sendStatus(403);
            }

            req.user = user;
            req.session.user = user;
            next();
        });
    } else {
        req.session.destroy();
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;
