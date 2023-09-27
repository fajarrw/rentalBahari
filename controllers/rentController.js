const Rent = require('../models/rentModel');
const Car = require('../models/carModel');
const User = require('../models/userModel');

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
		
		//check the existence of car and user
		const car = await Car.findById(carID)
		const customer = await User.findById(customerID)
		if (!car || !customer) {
			res.status(400).json({ error: "Bad request. Car or user does not exist" })
			return
		}

		//prepare rent data to be saved
		const rentData = {
			carID,
			customerID,
			start,
            end,
            status,
		}

		//save rent data
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
		//input validation
		if (!req.body._id) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}

		//check the existence of rent
		const _id = req.body._id;
		const rentToDelete = await Rent.findById(_id);
		if (!rentToDelete) {
			res.status(404).json({ message: "Rent does not exist" });
			return;
		}

		//delete rent
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
		const { carID, customerID, start, end, status } = req.body;
		const rentToEdit = await Rent.findById(_id);
		if (!rentToEdit) {
			res.status(404).json({ message: "Rent does not exist" });
			return;
		}
		await Rent.updateOne({ _id: _id }, {
            carID,
            customerID,
            start,
            end,
            status
        });
        res.status(200).json({ message: 'Rent updated successfully' });
	} catch (err) {
		console.error({ error: err });
		res.status(500).json({ error: err });
	}
};

const searchRent = async (req, res) => {
	try {
		const { _id, carID, customerID, start, end, status, order, sortBy } = req.query;
		var filter = {};

		// make a filter consisting of every inputted query
		if (_id) {
			filter = { ...filter, _id }
		} 
		if (carID) {
			filter = { ...filter, carID }
		}
		if (customerID) {
			filter = { ...filter, customerID }
		}
		if (status) {
			filter = { ...filter, status }
		}

		if (start && end) {
			filter = { ...filter, $or: [
				{ start: { $gte: new Date(start) } },
				{ end: { $lte: new Date(end) } }
			]}
		}

		// sort if user wants to sort. otherwise, don't
		if (sortBy && order) {
			const orderCode = parseInt(order); // order value has to be either 1 (asc) or -1 (desc)
			const sortOrder = { [sortBy]: orderCode };
			const response = await Rent.find(filter).sort(sortOrder);
			res.json(response);
		} else {
			const response = await Rent.find(filter);
			res.json(response);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err })
	}
};

module.exports = { getAllRent, createRent, deleteRent, editRent, searchRent };