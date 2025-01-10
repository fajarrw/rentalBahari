const express = require("express");

const router = express.Router();
const carController = require("../controllers/carController");
const authenticateToken = require("../middleware/authToken");

router.get("/all", carController.getAllCar);
router.get("/id/:id", carController.getCarById);
router.post("/create", authenticateToken, carController.createCar);
router.delete("/delete", authenticateToken, carController.deleteCar);
router.put("/edit", authenticateToken, carController.editCar);
router.get("/search", carController.searchCar);
router.get("/searchAvailableCar", carController.searchAvailableCar);

module.exports = router;