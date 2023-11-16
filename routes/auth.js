const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')
const Admin = require('../models/adminModel')

router.post('/', async (req, res) => {
    const { username, password } = await req.body
    const user = await User.findOne({ username: username })
    if (!user) return res.status(404).send({
        message: 'User not found'
    })
    bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
            return res.status(403).send({ message: 'wrong password' })
        }
        const userData = { username: user.username, password: user.password, role: 'user' }
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken: token, role: 'user' })
    })
})

router.post('/admin', async (req, res) => {
    const { username, password } = await req.body
    const admin = await Admin.findOne({ username: username })
    if (!admin) return res.status(404).send({
        message: 'Admin not found'
    })
    bcrypt.compare(password, admin.password, (err, same) => {
        if (!same) {
            return res.status(403).send({ message: 'wrong password' })
        }
        const userData = { username: admin.username, password: admin.password, role: 'admin' }
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken: token, role: 'admin' })
    })
})

module.exports = router;