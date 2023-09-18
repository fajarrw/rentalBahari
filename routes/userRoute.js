const express = require('express');

const User = require('../models/userModel');
const router = express.Router()

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({ users: users })
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err });
    }
})

// get user by id
router.get('/:id', async (req, res) => {
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
})

// post to user
router.post('/', async (req, res) => {
    try {
        const { username, email, password, telp } = await req.body

        //input validation
        if (!username || !email || !password || !telp) {
            res.status(400).json({ error: 'Bad request. Missing required fields' })
        }

        const userData = {
            username,
            email,
            password,
            telp,
        }
        const newUser = await User.create(userData)
        const savedUserData = await newUser.save()
        res.status(201).json({ message: 'User created successfully', user: savedUserData })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const userToDelete = await User.findById(_id)
        if (!userToDelete) {
            res.status(404).json({ message: 'User not exists' })
            return
        }

        await User.deleteOne({ _id: _id })
        res.status(204).json({ message: 'User deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
})

// PUT
router.put('/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const userToEdit = await User.findOne(_id)
        if (!userToEdit) {
            res.status(404).json({ message: 'User not exists' })
            return
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
})
module.exports = router;
