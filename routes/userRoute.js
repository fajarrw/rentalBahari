const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authToken');
const authenticateToken2 = require('../middleware/authToken2');

router.get('/', authenticateToken2, userController.getUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.post('/', userController.addUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/:id', authenticateToken2, userController.editUser);

module.exports = router;