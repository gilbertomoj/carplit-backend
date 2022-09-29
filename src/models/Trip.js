const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Trip = new Schema({
    data: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
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
        required: true,
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
