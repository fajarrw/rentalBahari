const express = require('express');

const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/:id', adminController.getAdminById)
router.post('/', adminController.createAdmin)
router.delete('/:id', adminController.deleteAdmin)
router.put('/:id', adminController.editAdmin)

module.exports = router;