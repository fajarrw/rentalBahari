// import Schema and model from mongoose
const { Schema, models, model } = require("mongoose");

const userSchema = Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), required: true },
    updatedAt: { type: Date, default: Date.now(), required: true },
    assuranceId: { type: String }
});

const userModel = models.User || model('user', userSchema);
module.exports = userModel;