const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken2 = require('../middleware/authToken2.js');

router.get('/', authenticateToken2, userController.getUser);
router.get('/:id', authenticateToken2, userController.getUserById);
router.post('/', userController.addUser);
router.delete('/:id', authenticateToken2, userController.deleteUser);
router.put('/:id', authenticateToken2, userController.editUser);

module.exports = router;