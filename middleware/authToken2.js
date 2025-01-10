const jwt = require('jsonwebtoken');

const authenticateToken2 = async (req, res, next) => {
    const token = req.cookies?.token; // Read token from cookie

    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        if (err) return res.sendStatus(403);
        if (userData.role !== 'user' && userData.role !== 'admin') return res.sendStatus(401);
        req.userData = userData;
        next();
    })
}

module.exports = authenticateToken2;