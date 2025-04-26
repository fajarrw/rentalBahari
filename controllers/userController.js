const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const ERR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
const ERR_USER_NOT_FOUND = 'User not found';
const ERR_USER_ALREADY_EXISTS = 'User already exists';

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userData._id);
        console.log(req.userData);
        // handle null user
        if (!user) {
            res.status(404).json({ error: ERR_USER_NOT_FOUND });
            return;
        }

        res.status(200).json({ user: user });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

const getUserById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id);

        // handle null user
        if (!user) {
            res.status(404).json({ error: ERR_USER_NOT_FOUND });
            return;
        }

        res.status(200).json({ user: user });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

const addUser = async (req, res) => {
    try {
        const { name, username, email, password, telp } = req.body;
        const SALT = 10;

        if (!name || !username || !email || !password || !telp) {
            return res.status(400).json({ error: ERR_MISSING_REQUIRED_FIELDS });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: ERR_USER_ALREADY_EXISTS });

        const hash = await bcrypt.hash(password, SALT);
        const userData = { name, username, email, password: hash, telp };
        const newUser = await User.create(userData);
        res.status(201).json({ message: 'User created successfully', _id: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const userToDelete = await User.findById(_id);
        if (!userToDelete) {
            res.status(404).json({ message: ERR_USER_NOT_FOUND });
            return;
        }
        await User.deleteOne({ _id: _id });
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

const editUser = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { username, email, password, telp } = req.body;
        const userToEdit = await User.findById(_id);
        if (!userToEdit) {
            res.status(404).json({ message: ERR_USER_NOT_FOUND });
            return;
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
        });
        res.status(204).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

module.exports = { getUser, getUserById, addUser, deleteUser, editUser };