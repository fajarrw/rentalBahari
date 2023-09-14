const express = require("express");
const mongodb = require("mongodb")
const { MongoClient } = require("mongodb");

const router = express.Router();
const Car = require("../models/carModel");

router.get("/all", async(req,res) => {
    try {
        const car = await Car.find({});
        return res.json({ car })
    } catch(error){
		return res.status(400).json({message: error});
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
	} finally {
	  await client.close();
	}
  });

router.put("/edit", async (req, res) => {
	try {
        const ObjectId = mongodb.ObjectId;
        const _id = req.body._id;
        const filter = new ObjectId(_id);
        const { name, type, price, model} = req.body;
        const update = { name, type, price, model };
        const response = await Car.findOneAndUpdate(filter, update, {new : true});
        res.json(response);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;