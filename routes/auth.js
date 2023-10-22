const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')

router.post('/', async (req, res) => {
    const { email, password } = await req.body
    const user = await User.findOne({ email: email })
    bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
            return res.status(403).send({ message: 'wrong password' })
        }
        const userData = { email: user.email, password: user.password }
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken: token })
    })
})

module.exports = router;