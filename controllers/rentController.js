const Rent = require('../models/rentModel');

const getAllRent = async (req, res) => {
	try {
		const rent = await Rent.find({});
		res.status(200).json({ rent });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err });
	}
};

const createRent = async (req, res) => {
	try {
		const { carID, customerID, start, end, status } = await req.body

		//input validation
		if (!carID || !customerID || !start || !end || !status) {
			res.status(400).json({ error: "Bad request. Missing required fields" })
			return
		}

		const rentData = {
			carID,
			customerID,
			start,
            end,
            status,
		}
		const newRent = await Rent.create(rentData)
		const savedRentData = await newRent.save()
		res.status(201).json({ message: "Rent created successfully", rent: savedRentData })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
};

const deleteRent = async (req, res) => {
	try {
		if (!req.body._id) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const rentToDelete = await Rent.findById(_id);
		if (!rentToDelete) {
			res.status(404).json({ message: "Rent does not exist" });
			return;
		}
		await Rent.deleteOne({ _id: _id });
		res.status(200).json({ message: "Rent deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
};

const editRent = async (req, res) => {
	try {
		if (!req.body._id || !req.body.start || !req.body.end || !req.body.status) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const {carID, customerID, start, end, status } = req.body;
		const rentToEdit = await Rent.findById(_id);
		if (!rentToEdit) {
			res.status(404).json({ message: "Car does not exist" });
			return;
		}
		await Rent.updateOne({ _id: _id }, {
            carID,
            customerID,
            start,
            end,
            status
        })
        res.status(200).json({ message: 'Rent updated successfully' })
	} catch (err) {
		console.error({ error: err });
		res.status(500).json({ error: err });
	}
};


module.exports = { getAllRent, createRent, deleteRent, editRent };