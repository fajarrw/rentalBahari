const Rent = require('../models/rentModel');
const Car = require('../models/carModel');
const User = require('../models/userModel');

const ERR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
const ERR_CAR_OR_USER_NOT_FOUND = 'Car or user does not exist';
const ERR_RENT_NOT_FOUND = 'Rent not found';

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
		const { carID, start, end, status } = await req.body;
		// const customerUsername = req.userData._id;

		//check the existence of user
		const customer = await User.findOne({ _id: req.userData._id });
		const customerID = customer._id;

		if (!carID || !customerID || !start || !end || !status) {
			res.status(400).json({ error: ERR_MISSING_REQUIRED_FIELDS });
			return;
		}

		//check the existence of car
		const car = await Car.findById(carID);
		if (!car || !customer) {
			res.status(400).json({ error: ERR_CAR_OR_USER_NOT_FOUND });
			return;
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
		const newRent = await Rent.create(rentData);
		const savedRentData = await newRent.save();

		res.status(201).json({ message: "Rent created successfully", rent: savedRentData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
};

const deleteRent = async (req, res) => {
	try {
		//input validation
		if (!req.body._id) {
			res.status(400).json({ message: ERR_MISSING_REQUIRED_FIELDS });
			return;
		}

		//check the existence of rent
		const _id = req.body._id;
		const rentToDelete = await Rent.findById(_id);
		if (!rentToDelete) {
			res.status(404).json({ message: ERR_RENT_NOT_FOUND });
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
			res.status(400).json({ message: ERR_MISSING_REQUIRED_FIELDS });
			return;
		}
		const _id = req.body._id;
		const { carID, customerID, start, end, status } = req.body;
		const rentToEdit = await Rent.findById(_id);
		if (!rentToEdit) {
			res.status(404).json({ message: ERR_RENT_NOT_FOUND });
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
			filter = { ...filter, _id };
		}
		if (carID) {
			filter = { ...filter, carID };
		}
		if (customerID) {
			filter = { ...filter, customerID };
		}
		if (status) {
			filter = { ...filter, status };
		}

		if (start && end) {
			filter = {
				...filter, $or: [
					{ start: { $gte: new Date(start) } },
					{ end: { $lte: new Date(end) } }
				]
			};
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
		res.status(500).json({ error: err });
	}
};

const finishRent = async (req, res) => {
	try {
		if (!req.params.id) {
			res.status(400).json({ message: ERR_MISSING_REQUIRED_FIELDS });
			return;
		}
		const { id } = req.params;
		const rentToEdit = await Rent.findById(id);
		if (!rentToEdit) {
			res.status(404).json({ message: ERR_RENT_NOT_FOUND });
			return;
		}
		await Rent.updateOne({ _id: id }, {
			status: 'off'
		});
		res.status(200).json({ message: 'Rent updated successfully' });
	} catch (err) {
		console.error({ error: err });
		res.status(500).json({ error: err });
	}
}

const getRentByUsername = async (req, res) => {
	try {
		const name = req.body.name;
		const user = await User.findOne({ username: name });

		if (!user) {
			return res.status(404).json({ error: name + " not found" });
		}

		// Fetch all rents where customerID is equal to userId
		const rents = await Rent.find({ customerID: user._id });

		if (!rents || rents.length === 0) {
			return res.status(200).json({ rents });
		}

		// Extract carIDs from the rents
		const carIds = rents.map(rent => rent.carID);

		// Fetch car data for the extracted carIDs
		const cars = await Car.find({ _id: { $in: carIds } });

		// Combine rents and car data
		const rentsWithCarData = rents.map(rent => {
			const carData = cars.find(car => car._id.toString() === rent.carID.toString());
			const days = 1 + Math.ceil((new Date(rent.end) - new Date(rent.start)) / (1000 * 60 * 60 * 24));
			const totalPrice = days * carData.price;

			return {
				...rent._doc, // Existing rent data
				car: {
					name: carData.name,
					type: carData.type,
					price: carData.price,
					model: carData.model,
					transmission: carData.transmission,
					seatNumber: carData.seatNumber,
					imageData: carData.imageData
				},
				start: rent.start,
				end: rent.end,
				totalPrice
			};
		});

		res.status(200).json({ rents: rentsWithCarData });

	} catch (err) {
		res.status(500).json({ error: err });
	}
}

const getRent = async (req, res) => {
	try {
		// Fetch all rents where customerID is equal to the authenticated user's ID
		const rents = await Rent.find({ customerID: req.userData._id });

		if (!rents || rents.length === 0) {
			return res.status(200).json({ rents });
		}

		// Extract carIDs from the rents
		const carIds = rents.map(rent => rent.carID);

		// Fetch car data for the extracted carIDs
		const cars = await Car.find({ _id: { $in: carIds } });

		// Combine rents and car data
		const rentsWithCarData = rents.map(rent => {
			const carData = cars.find(car => car._id.toString() === rent.carID.toString());
			const days = 1 + Math.ceil((new Date(rent.end) - new Date(rent.start)) / (1000 * 60 * 60 * 24));
			const totalPrice = days * carData.price;

			return {
				...rent._doc, // Existing rent data
				car: {
					name: carData.name,
					type: carData.type,
					price: carData.price,
					model: carData.model,
					transmission: carData.transmission,
					seatNumber: carData.seatNumber,
					imageData: carData.imageData
				},
				start: rent.start,
				end: rent.end,
				totalPrice
			};
		});

		res.status(200).json({ rents: rentsWithCarData });

	} catch (err) {
		res.status(500).json({ error: err });
	}
}

module.exports = { getAllRent, getRent, createRent, deleteRent, editRent, searchRent, finishRent };