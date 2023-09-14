const express = require("express");
const mongodb = require("mongodb")
const { MongoClient } = require("mongodb");

const router = express.Router();
const Car = require("../models/carModel");

router.get("/all", async (req, res) => {
	try {
		const car = await Car.find({});
		res.json({ car })
	} catch (error) {
		console.error(err);
		res.status(500).json({ message: error });
	}
})

router.post("/create", async (req, res) => {
	try {
		const { name, type, price, model } = await req.body

		//input validation
		if (!name || !type || !price || !model) {
			res.status(400).json({ error: "Bad request. Missing required fields" })
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
});

router.delete("/delete", async (req, res) => {
	const uri = process.env.MONGO_URL;
	const client = new MongoClient(uri);

	try {
		const database = client.db("RentalBahari");
		const cars = database.collection("cars");
		const ObjectId = mongodb.ObjectId;
		const id = req.body._id;
		const filter = { _id: new ObjectId(id) };
		const response = await cars.deleteOne(filter);
		res.json(response);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err })
	} finally {
		await client.close();
	}
});

router.put("/edit", async (req, res) => {
	try {
		const ObjectId = mongodb.ObjectId;
		const _id = req.body._id;
		const filter = new ObjectId(_id);
		const { name, type, price, model } = req.body;
		const update = { name, type, price, model };
		const response = await Car.findOneAndUpdate(filter, update, { new: true });
		res.json(response);
	} catch (err) {
		console.error({ error: err });
	}
});

router.get("/search", async (req, res) => {
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
			filter = { ...filter, price: { $lte: maxPrice, $gte: minPrice }  }
		} 
		else if (minPrice) {
			filter = { ...filter, price: { $gte: minPrice }}
		} 
		else if (maxPrice) {
			filter = { ...filter, price: { $lte: maxPrice }}
		}

		// sort if user wants to sort. otherwise, don't
		if (sortBy && order) {
			const orderCode = parseInt(order); // order value has to be either 1 (asc) or -1 (desc)
			const sortOrder = { price: orderCode }; 
			console.log(sortOrder);
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
});

module.exports = router;