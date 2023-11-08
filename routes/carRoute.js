const express = require("express");

const router = express.Router();
const carController = require("../controllers/carController");
const authToken = require("../middleware/authToken");

router.get("/all", carController.getAllCar);
router.get("/:id", carController.getCarById);
router.post("/create", authToken, carController.createCar);
router.delete("/delete", carController.deleteCar);
router.put("/edit", carController.editCar);
router.get("/search", carController.searchCar);
router.get("/searchAvailableCar", carController.searchAvailableCar);

module.exports = router;