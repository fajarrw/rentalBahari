const express = require('express');

const userController = require('../controllers/userController')
const router = express.Router()

router.get('/', userController.getAllUser)
router.get('/:id', userController.getUserById)
router.post('/', userController.addUser)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.editUser)


module.exports = router;
