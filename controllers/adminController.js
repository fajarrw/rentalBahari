const Admin = require('../models/adminModel')
const bcrypt = require('bcrypt')

const getAllAdmin = async (req, res) => {
    try {
        const admin = await Admin.find({})
        res.status(200).json({ admin: admin })
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err });
    }
}

const getAdminById = async (req, res) => {
    try {
        const _id = req.params.id
        const admin = await Admin.findById(_id)

        // handle null admin
        if (!admin) {
            res.status(404).json({ error: 'Admin not found' })
            return
        }

        res.status(200).json({ admin })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const _id = req.params.id
        const adminToDelete = await Admin.findById(_id)
        if (!adminToDelete) {
            res.status(404).json({ message: 'Admin not exists' })
            return
        }
        await Admin.deleteOne({ _id })
        res.status(204).json({ message: 'Admin deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

const createAdmin = async (req, res) => {
    try {
        const { username, password } = await req.body
        const SALT = 10
        //input validation
        if (!username || !password) {
            res.status(400).json({ error: "Bad request. Missing required fields" })
            return
        }
        const admin = await Admin.findOne({ username: username })
        if (admin !== null) return res.status(409).send({ message: "Admin already exists" })

        bcrypt.hash(password, SALT, async (err, hash) => {
            const adminData = {
                username,
                password: hash,
            }
            const newAdmin = await Admin.create(adminData)
            const savedAdminData = await newAdmin.save()
            res.status(201).json({
                message: 'Admin created successfully',
                _id: savedAdminData._id,
            })
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
};

const editAdmin = async (req, res) => {
    try {
        const _id = req.params.id
        const { username, password } = req.body
        const adminToEdit = await Admin.findById(_id)
        if (!adminToEdit) {
            res.status(404).json({ message: 'Admin does not exist' })
            return
        }
        await Admin.updateOne({ _id: _id }, {
            username: username,
            password: password,
        })
        res.status(204).json({ message: 'Admin updated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

module.exports = { getAllAdmin, getAdminById, createAdmin, deleteAdmin, editAdmin }
