const Car = require('../models/carModel');

const getAllCar = async (req, res) => {
	try {
		const car = await Car.find({});
		res.status(200).json({ car });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err });
	}
};

const createCar = async (req, res) => {
	try {
		const { name, type, price, model } = await req.body

		//input validation
		if (!name || !type || !price || !model) {
			res.status(400).json({ error: "Bad request. Missing required fields" })
			return
		}

		const carData = {
			name,
			type,
			price,
			model,
		}
		const newCar = await Car.create(carData)
		const savedCarData = await newCar.save()
		res.status(201).json({ message: "Car created successfully", car: savedCarData })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
};

const deleteCar = async (req, res) => {
	try {
		if (!req.body._id) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const carToDelete = await Car.findById(_id);
		if (!carToDelete) {
			res.status(404).json({ message: "Car does not exist" });
			return;
		}
		await Car.deleteOne({ _id: _id });
		res.status(200).json({ message: "Car deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
};

const editCar = async (req, res) => {
	try {
		if (!req.body._id || !req.body.name || !req.body.price || !req.body.model || !req.body.rent) {
			res.status(400).json({ message: "Bad request. Missing required fields" });
			return;
		}
		const _id = req.body._id;
		const { name, type, price, model, rent } = req.body;
		const carToEdit = await Car.findById(_id);
		if (!carToEdit) {
			res.status(404).json({ message: "Car does not exist" });
			return;
		}
		await Car.updateOne({ _id: _id }, {
            name,
            type,
            price,
            model,
			rent
        });
        res.status(200).json({ message: 'User updated successfully' });
	} catch (err) {
		console.error({ error: err });
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
			res.json(response);
		} else {
			const response = await Car.find(filter);
			res.json(response);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err })
	}
};

module.exports = { getAllCar, createCar, deleteCar, editCar, searchCar };