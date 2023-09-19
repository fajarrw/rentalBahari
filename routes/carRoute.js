const express = require("express");

const router = express.Router();
const carController = require("../controllers/carController");

router.get("/all", carController.getAllCar);
router.post("/create", carController.createCar);
router.delete("/delete", carController.deleteCar);
router.put("/edit", carController.editCar);
router.get("/search", carController.searchCar);

module.exports = router;