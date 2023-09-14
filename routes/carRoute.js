const express = require('express');

const router = express.Router();
const Car = require("../models/carModel");

router.get("/get-all-car", async(req,res) => {
    try {
        const car = await Car.find({});
        return res.json({ car })
    } catch(error){
		return res.status(400).json({message: error});
    }
})

module.exports = router;