const express = require("express");

const router = express.Router();
const rentController = require("../controllers/rentController");
const authenticateToken = require("../middleware/authToken");
const authenticateToken2 = require("../middleware/authToken2");

router.get("/all", authenticateToken, rentController.getAllRent);
router.post("/create", authenticateToken2, rentController.createRent);
router.delete("/delete", authenticateToken2, rentController.deleteRent);
router.put("/edit", authenticateToken2, rentController.editRent);
router.put("/finish/:id", authenticateToken2, rentController.finishRent);
router.get("/search", authenticateToken2, rentController.searchRent);
// router.post("/search/name", authenticateToken2, rentController.getRentByUsername);
router.get("/", authenticateToken2, rentController.getRent);

module.exports = router;