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
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        hidden: true,
    },
});

module.exports = mongoose.model("path", Path);
