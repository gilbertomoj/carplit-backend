const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    average_consumption: {
        type: Number,
        required: true,
    },
    fuel_per_liter: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("user", User);
