const User = require("../models/User");
const Trip = require("../models/Trip");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {
    async getTrips(user_id) {
        const trips = await Trip.findById(user_id).populate("passengers");
        return trips;
    },

    async createTrip(title, owner, passangers, totalDistance, data) {
        const trip = await Trip.create({
            title,
            owner,
            passangers,
            totalDistance,
            data,
        });
        return trip;
    },

    async getUserTips(owner) {
        try {
            const trips = await Trip.find({ owner });
            return trips;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
