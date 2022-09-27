const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const Passenger = new Schema({
    isDriver:{
        type: Boolean,
        required: true,
        default: false
    },
    name:{
        type: String,
        required: true,
        default: "Sem nome"
    },
    address: {
        type: String,
        required: true,
    },
    isOnDebt: {
        type: Boolean,
        default: false
    },
    debt: {
        type: Number,
        default: 0.0
    },
    // createdBy: {
    //     type: Object,
    //     required: true,
    //     hidden: true,
    // }
})

module.exports = mongoose.model("passenger", Passenger);