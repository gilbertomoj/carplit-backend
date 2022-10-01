const User = require("../models/User");
const Trip = require("../models/Trip");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
const check_permission = require("../config/check_permission");
require("dotenv").config();

module.exports = {
    async getTrips(user_id) {
        const trips = await Trip.findById(user_id).populate("passengers");
        return {
            trips,
            status: 200,
        };
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
            return {
                trips,
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOneTrip(user, id) {
        try {
            const trip = await Trip.findById(id);
            const permission = await permissions.checkPermission(
                user,
                trip.owner,
                "Você não tem permissão para visualizar esta carona."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            }
            return { trip, status: 200 };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deleteTrip(user, id) {
        try {
            const trip = await Trip.findById(id);
            const permission = await permissions.checkPermission(
                user,
                trip.owner,
                "Você não tem permissão para deletar esta carona."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                try {
                    const DeletedTrip = await Trip.findByIdAndDelete(id);
                    return {
                        message: "Carona deletada com sucesso",
                        status: 200,
                    };
                } catch (error) {
                    return { message: error, status: 400 };
                }
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
