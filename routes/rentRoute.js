const express = require("express");

const router = express.Router();
const rentController = require("../controllers/rentController");

router.get("/all", rentController.getAllRent);
router.post("/create", rentController.createRent);
router.delete("/delete", rentController.deleteRent);
router.put("/edit", rentController.editRent);
router.get("/search", rentController.searchRent)

module.exports = router;