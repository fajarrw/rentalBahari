const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const header = await req.header('authorization');
    const token = header?.split(' ')[1]

    if (token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        if (err) return res.sendStatus(403)
        req.userData = userData
        next()
    })
}

module.exports = authenticateToken