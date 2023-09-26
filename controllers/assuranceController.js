const Assurance = require('../models/assuranceModel');
const Validator = require('jsonschema').Validator;

//getall
const getAllAssurance = async (req, res) => {
	try {
		const assurance = await Assurance.find({});
		res.json({ assurance })
	} catch (error) {
		console.error(err);
		res.status(500).json({ message: error });
	}
};

//get one
const getAssuranceById  = async (req, res) => {
  try {
      const _id = req.params.id
      const assurance = await Assurance.findById(_id)

      // handle null user
      if (!assurance) {
          res.status(404).json({ error: 'Assurance not found' })
          return
      }

      res.status(200).json({ assurance: assurance })
  } catch (err) {
      res.status(500).json({ error: err })
  }
};

//create
const createAssurance = async (req, res) => {
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
  };

//delete
const deleteAssurance = async (req, res) => {
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
};

//edit
const editAssurance = async (req, res) => {
	try {
    //validate main keys
		if (!req.params.id || !req.body.nik || !req.body.foto_ktp || !req.body.alamat) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}

    //validate alamat json
    const schema = {
      type: 'object',
      properties: {
        jalan: { type: 'string' },
        kelurahan: { type: 'string' },
        kecamatan: { type: 'string' },
        kota: { type: 'string' },
        provinsi: { type: 'string' },
      },
      required: ['jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi'],
    };
    const validator = new Validator();
    if (!validator.validate(req.body.alamat, schema).valid){
      res.status(400).json({ message: "Missing alamat attribute or unmatched schema" })
      return;
    }

		const _id = req.params.id;
		const { alamat, nik, foto_ktp } = req.body;
		const assToEdit = await Assurance.findById(_id);
		if (!assToEdit) {
			res.status(404).json({ message: "Assurance does not exist" });
			return;
		}
		await Assurance.updateOne({ _id: _id }, {
            alamat,
            nik,
            foto_ktp
        })
        res.status(200).json({ message: 'Assurance updated successfully' })
	} catch (err) {
		console.error({ error: err });
		res.status(500).json({ error: err });
	}
};


module.exports = {getAllAssurance, getAssuranceById, createAssurance, deleteAssurance, editAssurance};