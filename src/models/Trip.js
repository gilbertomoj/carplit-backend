const mongoose = require("mongoose");
const moment = require("moment")


const Schema = mongoose.Schema;

const Trip = new Schema({
    date: {
        type: String,
        default: moment().locale("pt-br").format('dddd, MM/DD/YYYY'),
        required: true,
        hidden: true,
    },
    passengers: [
        {
            type: Schema.Types.ObjectId,
            ref: "passenger",
        },
    ],
    path: {
        type: Schema.Types.ObjectId,
        ref: "path",
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        hidden: true,
        immutable: true,
    },
    value: {
        type: Number,
        default: 0.0,
    },
    isOwnerIncluded: {
        type: Boolean,
        default: false,
        required: true,
    },
    isFixedValue: {
        type: Boolean,
        default: false,
        required: true,
    },
});

module.exports = mongoose.model("trip", Trip);
