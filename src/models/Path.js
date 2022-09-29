const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Path = new Schema({
    title: {
        type: String,
        required: true,
    },
    totalDistance: {
        type: Number,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        hidden: true,
        immutable: true,
    },
});

module.exports = mongoose.model("path", Path);
