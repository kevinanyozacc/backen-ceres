const jwt    = require('jsonwebtoken');

const protected = (req, res, next) => {
    const token = req.headers['access-token']

    if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {      
            if (err) {
                res.status(403).send({
                    message: 'Invalid token'
                });
                return
            }

            req.decoded = decoded;
            next();
        });
    } else {
        res.status(403).send({ 
            message: 'Token is mandatory' 
        });
    }
}

const semiprotected = (req, res, next) => {
    const token = req.headers['access-token']

    if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {      
            if (err) {
                res.status(403).send({
                    message: 'Invalid token'
                });
                return
            }

            req.decoded = decoded;
        });
    }

    next();
}

module.exports = {
    protected,
    semiprotected
};