// import Schema and model from mongoose
const { Schema, models, model } = require("mongoose");

const carSchema = Schema({
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
    rent: []
});

const carModel = models.Car || model('car', carSchema);
module.exports = carModel; 