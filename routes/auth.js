const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel')

const validatePassword = async (inputPassword, truePassword) => {
    const isValidated = await bcrypt.compare(inputPassword, truePassword)
    return isValidated
}

router.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
            return res.status(403).send({ message: 'wrong password' })
        }
        return res.status(200).send({ message: 'login success' })
    })
})

module.exports = router;