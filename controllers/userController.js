const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json({ users: users })
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err });
    }
}

const getUserById = async (req, res, next) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)

        // handle null user
        if (!user) {
            res.status(404).json({ error: 'User not found' })
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
            return res.status(400).send({ error: 'Bad request. Missing required fields' })
        }

        const user = await User.findOne({ email: email })
        if (user !== null) return res.status(409).send({ message: "User already exists" })

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
            res.status(404).json({ message: 'User not exists' })
            return
        }
        await User.deleteOne({ _id: _id })
        res.status(204).json({ message: 'User updated successfully' })
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
            res.status(404).json({ message: 'User not exists' })
            return
        }
        await User.updateOne({ _id: _id }, {
            username: username,
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

module.exports = { getAllUser, getUserById, addUser, deleteUser, editUser }