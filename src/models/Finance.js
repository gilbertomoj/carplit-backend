const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Finance = new Schema({
    passenger: {
        type: Schema.Types.ObjectId,
        ref: "passenger",
        required: true,
    },
    trips: [
        {
            type: Schema.Types.ObjectId,
            ref: "trip",
        },
    ],
});

module.exports = mongoose.model("finance", Finance);
