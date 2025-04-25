const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')
const Admin = require('../models/adminModel')

const ERR_WRONG_USERNAME_OR_PASSWORD = 'Username or password is wrong';
const ERR_USER_NOT_FOUND = 'User not found';
const ERR_ADMIN_NOT_FOUND = 'Admin not found';

const cookieConfigs = {
    httpOnly: false, // Allow access via document.cookie
    secure: true, // Required when SameSite=None
    sameSite: 'None', // Allow cross-site/subdomain usage
    domain: '.vercel.app', // Share across subdomains
    path: '/', // Apply cookie to all paths
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};

// const cookieConfigs = {
//     httpOnly: true, // Prevent client-side JavaScript access
//     secure: true, // Only sent over HTTPS
//     sameSite: 'None', // Required for cross-origin requests
//     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
// }

router.post('/', async (req, res) => {
    const { username, password } = await req.body;
    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).send({
        message: ERR_USER_NOT_FOUND
    })
    bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
            return res.status(403).send({ message: ERR_WRONG_USERNAME_OR_PASSWORD });
        }
        const userData = { _id: user._id, role: 'user' };
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('token', token, cookieConfigs);
        // res.json({ accessToken: token, role: 'user' });
        res.status(200).json({ message: 'Login successful' });
    })
})

router.post('/admin', async (req, res) => {
    const { username, password } = await req.body;
    const admin = await Admin.findOne({ username: username });
    if (!admin) return res.status(404).send({
        message: ERR_ADMIN_NOT_FOUND
    })
    bcrypt.compare(password, admin.password, async (err, same) => {
        if (!same) {
            return res.status(403).send({ message: ERR_WRONG_USERNAME_OR_PASSWORD });
        }
        const adminData = { _id: admin._id, role: 'admin' };
        const token = jwt.sign(adminData, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('token', token, cookieConfigs);
        await Admin.updateOne({ _id: admin._id }, {
            lastLogin: Date.now()
        })
        res.json({ message: 'Login successful' });
    });
})

module.exports = router;