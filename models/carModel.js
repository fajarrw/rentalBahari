const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
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

const carModel = mongoose.model('car', carSchema); //car di sini adalah nama collection yang ada di MongoDB
module.exports = carModel; 