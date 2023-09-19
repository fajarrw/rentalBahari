const express = require("express");

const router = express.Router();
const Assurance = require("../models/assuranceModel");

router.get("/", async (req, res) => {
	try {
		const assurance = await Assurance.find({});
		res.json({ assurance })
	} catch (error) {
		console.error(err);
		res.status(500).json({ message: error });
	}
})

module.exports = router;