const Passenger = require("../models/Passenger");
const Trips = require("../models/Trip");


const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
const check_permission = require("../config/check_permission");
const Passenger_Trip = require("../models/Passenger_Trip");
const TripController = require("./TripController");
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

            const passenger_finance = await Passenger_Trip.find({ passenger_id: id}).populate({path : "trip_id", populate: {path: 'path'}})
            // const passenger = await Passenger.findById(passenger_id).populate({path: "carpoolHistory", populate : { path : 'path' }})

            var totalDebt = 0
            var totalPaid = 0
            var tripHistory = []
            passenger_finance.forEach((element) => {

                tripHistory.push({
                        trip_id: element.trip_id._id,
                        trip_path: element.trip_id.path.title,
                        date: element.date,
                        value: element.value,
                        isPaid: element.hasPaid
                    })
                
                if(element.hasPaid){
                    totalPaid += element.value
                }else{
                    totalDebt += element.value
                }
            })

            const obj = {
                passenger,
                tripHistory,
                totalDebt,
                totalPaid
            }
            return {
                obj,
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
            console.log(passenger)
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
                const foundPassengerTrips = await Passenger_Trip.find({ passenger_trip: id})
                foundPassengerTrips.forEach(async (element)=>{
                    const deletePassengers = await Passenger_Trip.findOneAndDelete( element.passenger_id )
                    console.log("deletado")
                })
                return {
                    message: "Passageiro deletado com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
 
    async updateAllDebts(user, id) {
        try {
            const passenger = await Passenger.findById(id);
            const permission = await permissions.checkPermission(
                user,
                passenger.owner,
                "Você não tem permissão para atualizar este passageiro."
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
                        debt: 0, // debt = 0
                        isOnDebt: false, // isOnDebt -> false
                    },
                    { new: true }
                );
                return {
                    updatedPassenger,
                    message: "Divida atualizada com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    }
};
