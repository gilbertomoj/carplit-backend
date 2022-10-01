const Passenger = require("../models/Passenger");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
const check_permission = require("../config/check_permission");
require("dotenv").config();

module.exports = {
    async createPassenger(name, address, owner) {
        try {
            const passenger = await Passenger.create({
                name,
                address,
                owner,
            });

            return { passenger, status: 200 };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getPassengers() {
        // Rota para uso do admin !!!!!
        try {
            const Passengers = await Passenger.find();
            return Passengers;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getUserPassengers(owner) {
        try {
            const passengers = await Passenger.find({ owner });
            return {
                passengers,
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOnePassenger(user, id) {
        try {
            const passenger = await Passenger.findById(id);
            const permission = await permissions.checkPermission(
                user,
                passenger.owner,
                "Você não tem permissão para visualizar este passageiro."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            }
            return {
                passenger,
                message: "Passageiro recuperado com sucesso",
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async updatePassenger(user, id, name, address) {
        try {
            const passenger = await Passenger.findById(id);
            const permission = await permissions.checkPermission(
                user,
                passenger.owner,
                "Você não tem permissão para editar este passageiro."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                const updatedPassenger = await Passenger.findByIdAndUpdate(
                    id,
                    {
                        name,
                        address,
                    },
                    { new: true }
                );
                return {
                    updatedPassenger,
                    message: "Passageiro atualizado com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deletePassenger(user, id) {
        try {
            const passenger = await Passenger.findById(id);
            const permission = await permissions.checkPermission(
                user,
                passenger.owner,
                "Você não tem permissão para deletar este passageiro."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                const deletedPassenger = await Passenger.findByIdAndDelete(id);
                return {
                    message: "Passageiro deletado com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
