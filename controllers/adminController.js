const bcrypt = require('bcrypt');

const Admin = require('../models/adminModel');

const ERR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
const ERR_ADMIN_NOT_FOUND = 'Admin not found';
const ERR_ADMIN_ALREADY_EXISTS = 'Admin already exists';

const getAllAdmin = async (req, res) => {
    try {
        const admin = await Admin.find({});
        res.status(200).json({ admin: admin });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err });
    }
}

const getAdminById = async (req, res) => {
    try {
        const _id = req.params.id;
        const admin = await Admin.findById(_id);

        // handle null admin
        if (!admin) {
            res.status(404).json({ error: ERR_ADMIN_NOT_FOUND });
            return;
        }

        res.status(200).json({ admin });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const _id = req.params.id;
        const adminToDelete = await Admin.findById(_id);
        if (!adminToDelete) {
            res.status(404).json({ message: ERR_ADMIN_NOT_FOUND });
            return;
        }
        await Admin.deleteOne({ _id });
        res.status(204).json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const SALT = 10;

        if (!username || !password) {
            return res.status(400).json({ error: ERR_MISSING_REQUIRED_FIELDS });
        }

        const admin = await Admin.findOne({ username });
        if (admin) return res.status(409).json({ message: ERR_ADMIN_ALREADY_EXISTS });

        const hash = await bcrypt.hash(password, SALT);
        const adminData = { username, password: hash };
        const newAdmin = await Admin.create(adminData);
        res.status(201).json({ message: 'Admin created successfully', _id: newAdmin._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const editAdmin = async (req, res) => {
    try {
        const _id = req.params.id;
        const { username, password } = req.body;
        const adminToEdit = await Admin.findById(_id);
        if (!adminToEdit) {
            res.status(404).json({ message: ERR_ADMIN_NOT_FOUND });
            return;
        }
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }
        await Admin.updateOne({ _id: _id }, {
            username: username,
            password: password,
        });
        res.status(204).json({ message: 'Admin updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

module.exports = { getAllAdmin, getAdminById, createAdmin, deleteAdmin, editAdmin };
