const bcrypt = require('bcrypt')

const User = require('../models/userModel')

const ERR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
const ERR_USER_NOT_FOUND = 'User not found';
const ERR_USER_ALREADY_EXISTS = 'User already exists';

const getUserById = async (req, res, next) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)

        // handle null user
        if (!user) {
            res.status(404).json({ error: ERR_USER_NOT_FOUND })
            return
        }

        res.status(200).json({ user: user })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const addUser = async (req, res, next) => {
    try {
        let { name, username, email, password, telp } = await req.body
        const SALT = 10
        //input validation
        if (!name || !username || !email || !password || !telp) {
            return res.status(400).send({ error: ERR_MISSING_REQUIRED_FIELDS })
        }

        const user = await User.findOne({ email: email })
        if (user !== null) return res.status(409).send({ message: ERR_USER_ALREADY_EXISTS })

        bcrypt.hash(password, SALT, async (err, hash) => {
            const userData = {
                name,
                username,
                email,
                password: hash,
                telp,
            }

            const newUser = await User.create(userData)
            const savedUserData = await newUser.save()
            res.status(201).json({
                message: 'User created successfully',
                _id: savedUserData._id,
            })
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const _id = req.params.id
        const userToDelete = await User.findById(_id)
        if (!userToDelete) {
            res.status(404).json({ message: ERR_USER_NOT_FOUND })
            return
        }
        await User.deleteOne({ _id: _id })
        res.status(204).json({ message: 'User deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

const editUser = async (req, res, next) => {
    try {
        const _id = req.params.id
        const { username, email, password, telp } = req.body
        const userToEdit = await User.findById(_id)
        if (!userToEdit) {
            res.status(404).json({ message: ERR_USER_NOT_FOUND })
            return
        }
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }
        await User.updateOne({ _id: _id }, {
            name: username,
            email: email,
            password: password,
            telp: telp,
            updatedAt: Date.now()
        })
        res.status(204).json({ message: 'User updated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

module.exports = { getUserById, addUser, deleteUser, editUser }