const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Passenger_Trip = new Schema({
    passenger_id: {
        type: Schema.Types.ObjectId,
        ref: "passenger",
        required: true,
        hidden: true,
        immutable: true,
    },
    trip_id: {
        type: Schema.Types.ObjectId,
        ref: "trip",
        required: true,
        hidden: true,
        immutable: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        hidden: true,
        immutable: true,
    },
    value: {
        type: Number,
        required: true,
        default: 0.0
    },
    hasPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    date : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("passenger_trip", Passenger_Trip);
