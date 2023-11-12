const Logger = require('../lib/logger');
const Car = require('../models/carModel');
const Rent = require('../models/rentModel');

const getAllCar = async (req, res) => {
	try {
		const car = await Car.find({});
		Logger.Get(req)
		res.status(200).json({ car });
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ message: 'Internal server error' });
	}
};

const getCarById = async (req, res) => {
	try {
		const _id = req.params.id;
		const car = await Car.findById(_id);

		// handle null car
		if (!car) {
			res.status(404).json({ error: 'Car not found' });
			return;
		}

		res.status(200).json({ car });
	} catch (err) {
		res.status(500).json({ error: err });
	}
}

const createCar = async (req, res) => {
	try {
		const { imageData, name, type, price, model, transmission, seatNumber } = await req.body
		//input validation
		if (!name || !type || !price || !model || !imageData || !seatNumber || !transmission) {
			Logger.BadRequest(req)
			res.status(400).json({ error: "Bad request. Missing required fields" })
			return
		}

		const carData = {
			name,
			type,
			price,
			model,
			imageData,
			transmission,
			seatNumber
		}
		const newCar = await Car.create(carData)
		const savedCarData = await newCar.save()
		Logger.Post(req, savedCarData._id)
		res.status(201).json({
			message: "Car created successfully",
			car: savedCarData
		})
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ error: err })
	}
};

const deleteCar = async (req, res) => {
	try {
		if (!req.body._id) {
			Logger.BadRequest(req)
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const carToDelete = await Car.findById(_id);
		if (!carToDelete) {
			Logger.NotFound(req)
			res.status(404).json({ message: "Car does not exist" });
			return;
		}
		await Car.deleteOne({ _id: _id });
		Logger.Delete(req)
		res.status(200).json({ message: "Car deleted successfully" });
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ error: err });
	}
};

const editCar = async (req, res) => {
	try {
		if (!req.body._id || !req.body.name || !req.body.price || !req.body.model) {
			Logger.BadRequest(req);
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const { name, type, price, model } = req.body;
		const carToEdit = await Car.findById(_id);
		if (!carToEdit) {
			Logger.NotFound(req)
			res.status(404).json({ message: "Car does not exist" });
			return;
		}
		await Car.updateOne({ _id: _id }, {
			name,
			type,
			price,
			model
		});
		Logger.Update(req)
		res.status(200).json({ message: 'Car updated successfully' });
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ error: err });
	}
};

const searchCar = async (req, res) => {
	try {
		const { model, type, maxPrice, minPrice, order, sortBy } = req.query;
		var filter = {};

		// make a filter consisting of every inputted query 
		if (model) {
			filter = { ...filter, model }
		}
		if (type) {
			filter = { ...filter, type }
		}

		if (maxPrice && minPrice) {
			filter = { ...filter, price: { $lte: maxPrice, $gte: minPrice } }
		}
		else if (minPrice) {
			filter = { ...filter, price: { $gte: minPrice } }
		}
		else if (maxPrice) {
			filter = { ...filter, price: { $lte: maxPrice } }
		}

		// sort if user wants to sort. otherwise, don't
		if (sortBy && order) {
			const orderCode = parseInt(order); // order value has to be either 1 (asc) or -1 (desc)
			const sortOrder = { [sortBy]: orderCode };
			const response = await Car.find(filter).sort(sortOrder);
			Logger.Get(req)
			res.json(response);
		} else {
			const response = await Car.find(filter);
			Logger.Get(req)
			res.json(response);
		}
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ error: err })
	}
};

const searchAvailableCar = async (req, res) => {
	try {
		const { start, end, model, type, maxPrice, minPrice, order, sortBy } = req.query;

		if (!start || !end) {
			Logger.BadRequest(req)
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}

		filter = {
			$or: [
				{ start: { $gte: new Date(start) } },
				{ end: { $lte: new Date(end) } }
			]
		}

		var carID = [];
		const rent = await Rent.find(filter);
		rent.forEach(function (u) { carID.push(u.carID) });

		var carFilter = { _id: { $nin: carID } };
		if (model) {
			carFilter = { ...carFilter, model }
		}
		if (type) {
			carFilter = { ...carFilter, type }
		}

		if (maxPrice && minPrice) {
			carFilter = { ...carFilter, price: { $lte: maxPrice, $gte: minPrice } }
		}
		else if (minPrice) {
			carFilter = { ...carFilter, price: { $gte: minPrice } }
		}
		else if (maxPrice) {
			carFilter = { ...carFilter, price: { $lte: maxPrice } }
		}

		if (sortBy && order) {
			const orderCode = parseInt(order); // order value has to be either 1 (asc) or -1 (desc)
			const sortOrder = { [sortBy]: orderCode };
			const response = await Car.find(carFilter).sort(sortOrder);
			Logger.Get(req)
			res.json(response);
		} else {
			const response = await Car.find(carFilter);
			Logger.Get(req)
			res.json(response);
		}
	} catch (err) {
		Logger.Error(req, __filename, err)
		res.status(500).json({ error: err });
	}
};

module.exports = { getAllCar, getCarById, createCar, deleteCar, editCar, searchCar, searchAvailableCar };