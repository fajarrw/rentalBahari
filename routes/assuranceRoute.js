const express = require("express");

const router = express.Router();
const assuranceController = require('../controllers/assuranceController')
const authenticateToken = require('../middleware/authToken');
const authenticateToken2 = require('../middleware/authToken2');

router.get('/all', authenticateToken, assuranceController.getAllAssurance);
// router.get('/:id', authenticateToken2, assuranceController.getAssuranceById);
// router.get('/user/:name', authenticateToken, assuranceController.getAssuranceByUsername);
router.get('/', authenticateToken, assuranceController.getAssuranceByToken);
router.post('/create', authenticateToken2, assuranceController.createAssurance);
router.delete('/:id', authenticateToken2, assuranceController.deleteAssurance);
router.put('/:id', authenticateToken2, assuranceController.editAssurance);
router.put('/profile', authenticateToken2, assuranceController.editProfile);

module.exports = router;