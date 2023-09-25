const mongoose = require("mongoose");

const rentSchema = mongoose.Schema({
    carID: {
        type: String,
        required: true
    },
    customerID: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        default: Date.now(),
        required: true
    },
    end: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const rentModel = mongoose.model('rent', rentSchema);
module.exports = rentModel; 