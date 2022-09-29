const Passenger = require("../models/Passenger");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
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
            if (passengers.length === 0) {
                return {
                    message: "Você ainda não cadastrou caminhos.",
                    status: 200,
                };
            }
            return passengers;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOnePassenger(user, id) {
        try {
            const passenger = await Passenger.findOne({ where: { id } });
            if (user != passenger.owner) {
                return {
                    message: "Você não tem permissão para ver",
                    status: 400,
                };
            }
            return passenger;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async updatePassenger(user, id, name, address) {
        try {
            const passenger = await Passenger.findById(id);
            if (user != passenger.owner) {
                return {
                    message: "Você não tem permissão para atualizar",
                    status: 400,
                };
            } else {
                const UpdatedPassenger = await Passenger.findByIdAndUpdate(
                    id,
                    {
                        name,
                        address,
                    },
                    { new: true }
                );
                return {
                    message: "Passageiro atualizado com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deletePassenger(id) {
        try {
            const passenger = await Passenger.findById(id);
            if (user != passenger.owner) {
                return {
                    message: "Você não tem permissão para deletar",
                    status: 400,
                };
            } else {
                const DeletedPassenger = await Passenger.findByIdAndDelete(id);
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
