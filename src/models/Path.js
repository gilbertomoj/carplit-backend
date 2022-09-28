const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Path = new Schema({
    title: {
        type: String,
        required: true,
        default: "(Sem Nome)",
    },
    totalDistance: {
        type: Number,
        required: true,
        default: 0,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
        immutable: true,
    },
});

module.exports = mongoose.model("path", Path);
