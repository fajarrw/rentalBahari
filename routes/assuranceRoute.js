const express = require("express");

const router = express.Router();
const assuranceController = require('../controllers/assuranceController')

router.get('/', assuranceController.getAllAssurance);
router.get('/:id', assuranceController.getAssuranceById);
router.get('/user/:name', assuranceController.getAssuranceByUsername);
router.post('/create', assuranceController.createAssurance);
router.delete('/:id', assuranceController.deleteAssurance);
router.put('/:id', assuranceController.editAssurance);
router.put('/profile', assuranceController.editProfile)

module.exports = router;