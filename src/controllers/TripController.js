const User = require("../models/User");
const Trips = require("../models/Trips");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {
    async getTrips(user_id){
        const trips = await Trips.find({where:{driver: user_id}});
        return trips;
    },

    async createTrips( title, driver, passengers, total_distance, data ){
        try {
            const trip = await Trips.create({
                title,
                driver,
                passengers,
                total_distance,
                data
            })
            return trip;
        } catch (error) {
            return {message: error, status: 400}
        }


    }
}
