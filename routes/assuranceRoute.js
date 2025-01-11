const express = require("express");

const router = express.Router();
const assuranceController = require('../controllers/assuranceController');
const authenticateToken = require('../middleware/authToken');
const authenticateToken2 = require('../middleware/authToken2');

router.get('/all', authenticateToken, assuranceController.getAllAssurance);
// router.get('/:id', authenticateToken2, assuranceController.getAssuranceById);
// router.get('/user/:name', authenticateToken, assuranceController.getAssuranceByUsername);
router.get('/', authenticateToken2, assuranceController.getAssurance);
// router.post('/create', authenticateToken2, assuranceController.createAssurance);
router.delete('/:id', authenticateToken2, assuranceController.deleteAssurance);
router.put('/profile', authenticateToken2, assuranceController.editProfile);
router.put('/:id', authenticateToken2, assuranceController.editAssurance);

module.exports = router;