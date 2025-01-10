const Validator = require('jsonschema').Validator;

const Assurance = require('../models/assuranceModel');
const User = require('../models/userModel');

const ERR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
const ERR_ASSURANCE_NOT_FOUND = 'Assurance not found';
const ERR_USER_NOT_FOUND = 'User not found';

const getAllAssurance = async (req, res) => {
	try {
		const assurance = await Assurance.find({});
		res.json({ assurance })
	} catch (error) {
		console.error(err);
		res.status(500).json({ message: error });
	}
};

// const getAssuranceById = async (req, res) => {
// 	try {
// 		const _id = req.params.id
// 		const assurance = await Assurance.findById(_id)

// 		// handle null user
// 		if (!assurance) {
// 			res.status(404).json({ error: ERR_ASSURANCE_NOT_FOUND })
// 			return
// 		}

// 		res.status(200).json({ assurance: assurance })
// 	} catch (err) {
// 		res.status(500).json({ error: err })
// 	}
// };

// const getAssuranceByUsername = async (req, res) => {
// 	try {
// 		const name = req.params.name
// 		const user = await User.findOne({ username: name })
// 		const assurance = await Assurance.findById(user.assuranceId)

// 		const outJSON = Object.assign({}, { assurance }, { userId: user._id, name: user.name, username: user.username, telp: user.telp })

// 		// handle null user
// 		if (!assurance) {
// 			outJSON.assurance = {
// 				alamat: {
// 					jalan: "",
// 					kelurahan: "",
// 					kecamatan: "",
// 					kota: "",
// 					provinsi: "",
// 				},
// 				nik: "",
// 				foto_ktp: "an_image"
// 			}
// 			res.status(200).json(outJSON)
// 			return
// 		}
// 		res.status(200).json(outJSON)

// 	} catch (err) {
// 		res.status(500).json({ error: err })
// 	}
// };

const getAssuranceByToken = async (req, res) => {
	try {
		const assurance = await Assurance.findById(req.assuranceId);

		const outJSON = Object.assign({}, { assurance }, { userId: req._id, name: req.name, username: req.username, telp: req.telp });

		// handle null user
		if (!assurance) {
			outJSON.assurance = {
				alamat: {
					jalan: "",
					kelurahan: "",
					kecamatan: "",
					kota: "",
					provinsi: "",
				},
				nik: "",
				foto_ktp: "an_image"
			};
			res.status(200).json(outJSON);
			return;
		}
		res.status(200).json(outJSON);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
}

const createAssurance = async (req, res) => {
	try {
		const { alamat, nik, foto_ktp, username } = req.body;

		// Input validation
		if (!alamat || !nik || !foto_ktp) {
			return res.status(400).json({ error: ERR_MISSING_REQUIRED_FIELDS });
		}
		// Check the existence of user
		const user = await User.findOne({ username: username });
		if (!user) {
			res.status(400).json({ error: ERR_USER_NOT_FOUND });
			return;
		}

		// Create a new assurance document
		const newAssurance = new Assurance({
			alamat,
			nik,
			foto_ktp,
		});

		// Save the new assurance document to the database
		const savedAssurance = await newAssurance.save();

		// Save assurance id to its user
		user.assuranceId = savedAssurance._id;
		await user.save();

		res.status(201).json({ message: "Assurance created successfully", assurance: savedAssurance });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
};

const deleteAssurance = async (req, res) => {
	try {
		const assuranceId = req.params.id;

		// Check if the assurance document with the given ID exists
		const existingAssurance = await Assurance.findById(assuranceId);

		if (!existingAssurance) {
			return res.status(404).json({ error: ERR_ASSURANCE_NOT_FOUND });
		}

		// Find the user that has the assurance id
		await User.updateOne(
			{ assuranceId: assuranceId },
			{ $unset: { assuranceId: "" } }
		);

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

		// //validate alamat json
		// const schema = {
		// 	type: 'object',
		// 	properties: {
		//     jalan: { type: 'string' },
		//     kelurahan: { type: 'string' },
		//     kecamatan: { type: 'string' },
		//     kota: { type: 'string' },
		//     provinsi: { type: 'string' },
		// 	},
		// };
		// const validator = new Validator();
		// if (!validator.validate(req.body.alamat, schema).valid){
		// 	res.status(400).json({ message: "Missing alamat attribute or unmatched schema" })
		// 	return;
		// }

		const _id = req.params.id;
		const { alamat, nik, foto_ktp } = req.body;
		const assToEdit = await Assurance.findById(_id);
		if (!assToEdit) {
			res.status(404).json({ message: ERR_ASSURANCE_NOT_FOUND });
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

const editProfile = async (req, res) => {
	try {
		const { assurance, name, telp, userId, username } = req.body;
		const userTarget = await User.findOne({ username: username });
		if (!userTarget.assuranceId) {
			await User.updateOne({ username: username }, {
				name: name,
				telp: telp,
				updatedAt: Date.now()
			})
			await createAssurance({ body: { alamat: assurance.alamat, nik: assurance.nik, foto_ktp: assurance.foto_ktp, username } }, res);
		}
		else {
			await User.updateOne({ username: username }, {
				name: name,
				telp: telp,
				updatedAt: Date.now()
			})
			await editAssurance({ params: { id: userTarget.assuranceId }, body: { alamat: assurance.alamat, nik: assurance.nik, foto_ktp: assurance.foto_ktp } }, res);
		}

	} catch (err) {
		console.error({ error: err });
		res.status(500).json({ error: err });
	}
};

module.exports = { getAllAssurance, getAssuranceByToken, createAssurance, deleteAssurance, editAssurance, editProfile };