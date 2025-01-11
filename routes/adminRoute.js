const express = require('express');

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authToken');

const router = express.Router();

router.get('/', authenticateToken, adminController.getAllAdmin);
router.get('/:id', authenticateToken, adminController.getAdminById);
router.post('/', authenticateToken, adminController.createAdmin);
router.delete('/:id', authenticateToken, adminController.deleteAdmin);
router.put('/:id', authenticateToken, adminController.editAdmin);

module.exports = router;