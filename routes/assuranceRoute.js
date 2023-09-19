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

router.post("/create", async (req, res) => {
    try {
      const { alamat, nik, foto_ktp } = req.body;
  
      // Input validation
      if (!alamat || !nik || !foto_ktp) {
        return res.status(400).json({ error: "Bad request. Missing required fields" });
      }
  
      // Create a new assurance document
      const newAssurance = new Assurance({
        alamat,
        nik,
        foto_ktp,
      });
  
      // Save the new assurance document to the database
      const savedAssurance = await newAssurance.save();
  
      res.status(201).json({ message: "Assurance created successfully", assurance: savedAssurance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  });

router.delete("/:id", async (req, res) => {
    try {
        const assuranceId = req.params.id;

        // Check if the assurance document with the given ID exists
        const existingAssurance = await Assurance.findById(assuranceId);

        if (!existingAssurance) {
        return res.status(404).json({ error: "Assurance not found" });
        }

        // Delete the assurance document
        await Assurance.findByIdAndDelete(assuranceId);

        res.status(200).json({ message: "Assurance deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;