// import Schema and model from mongoose
const { Schema, models, model } = require("mongoose");

const carSchema = Schema({
    imageData: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    }
});

const carModel = models.Car || model('car', carSchema);
module.exports = carModel; 