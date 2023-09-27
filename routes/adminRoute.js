const express = require('express');

const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', adminController.getAllAdmin)
router.get('/:id', adminController.getAdminById)
router.post('/', adminController.createAdmin)
router.delete('/:id', adminController.deleteAdmin)
router.put('/:id', adminController.editAdmin)

// router.get("/", async (req, res) => {
// 	try {
// 		const admin = await Admin.find({});
// 		res.json({ admin })
// 	} catch (error) {
// 		console.error(err);
// 		res.status(500).json({ message: error });
// 	}
// })

module.exports = router;