// import Schema and model from mongoose
const { Schema, models, model } = require("mongoose");

const adminSchema = Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now(), required: true },
});

const adminModel = models.Admin || model('admin', adminSchema);
module.exports = adminModel;