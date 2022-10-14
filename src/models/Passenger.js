const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const Passenger = new Schema({
    isDriver: {
        type: Boolean,
        required: true,
        default: false,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        hidden: true,
        immutable: true,
    },
    carpoolHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "trip",
            required: false,
        },
    ],
});

module.exports = mongoose.model("passenger", Passenger);
