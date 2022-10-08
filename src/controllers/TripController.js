const User = require("../models/User");
const Trip = require("../models/Trip");
const Passenger = require("../models/Passenger");
const Path = require("../models/Path");
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

    async createTrip(passengers, path, value, isOwnerIncluded, isFixedValue, owner) {
        // 
        const ownerValue = this.ownerIncluded(isOwnerIncluded);
        if(isFixedValue) {
            const sharedValue = value / (passengers.length + ownerValue);

            const createdTrip = await Trip.create({
                path,
                passengers,
                value,
                isOwnerIncluded,
                isFixedValue,
                owner
            })

            passengers.forEach(async element => {
                const passenger_find = await Passenger.findById({ _id: element._id });
                console.log(passenger_find);
                let history_trips = new Array();
                history_trips = passenger_find.carpoolHistory;
                history_trips.push(createdTrip._id);
                const passengerUpdate = await Passenger.findOneAndUpdate({_id: element._id},{ isOnDebt: true, debt: sharedValue, carpoolHistory: history_trips}, {new: true}); 
                console.log(passengerUpdate)

            });

            return { trips: createdTrip, status: 200 };
        } else {       
            const path_find = await Path.findById({ _id: path });
            const user_find = await User.findById({ _id: owner._id });
            let totalValue = (path_find.totalDistance / user_find.average_consumption) * user_find.fuel_per_liter;

            const createdTrip = await Trip.create({
                path,
                passengers,
                value: totalValue,
                isOwnerIncluded,
                isFixedValue,
                owner
            })

            const sharedValue = totalValue / (passengers.length + ownerValue);
            passengers.forEach(async element => {
                const passenger_find = await Passenger.findById({ _id: element._id });
                let history_trips = new Array();
                history_trips = passenger_find.carpoolHistory;
                history_trips.push(createdTrip._id);
                const passengerUpdate = await Passenger.findOneAndUpdate({_id: element._id},{ isOnDebt: true, debt: sharedValue, carpoolHistory: history_trips}, {new: true}); 
            });
            return { trips: createdTrip, status: 200 };
        }   

    },

    async passengerPayment(passenger_id){
        try {
            const passenger = await Passenger.findOneAndUpdate({_id: passenger_id},{ isOnDebt: false, debt: 0}, {new: true});

            return {passenger: "Pagamento feito com sucesso", status: 200 };
            
        } catch (error) {
            return { error: "Internal server error", status: 500 };
        }

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

    ownerIncluded(value) {
        if (value){
            return 1;
        } else {
            return 0;
        }
    }
};
