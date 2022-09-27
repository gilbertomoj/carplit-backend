const User = require("../models/User");
const Trips = require("../models/Trips");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {

    async getTrips(user_id) {
        const trips = await Trips.findById(user_id).populate("passengers");
        return trips;
    },

    async createTrips(title, driver, passangers, totalDistance, data) {
        const trip = await Trips.create({
            title,
            driver,
            passangers,
            totalDistance,
            data,
        });
        return trip;
    },
};

