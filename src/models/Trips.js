const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Trip = new Schema({
    title: {
        type: String,
        required: true,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
    },
    passengers: [
        {
            type: Schema.Types.ObjectId,
            ref: "passenger",
        },
    ],
    totalDistance: {
        type: Number,
        required: true,
    },
    data: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("trip", Trip);
