const express = require("express");

const router = express.Router();
const rentController = require("../controllers/rentController");
const authenticateToken2 = require("../middleware/authToken2");

router.get("/all", rentController.getAllRent);
router.post("/create", authenticateToken2, rentController.createRent);
router.delete("/delete", rentController.deleteRent);
router.put("/edit", rentController.editRent);
router.put("/finish/:id", rentController.finishRent);
router.get("/search", rentController.searchRent);

module.exports = router;