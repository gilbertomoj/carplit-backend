const moment = require("moment")
const User = require("../models/User");
const Trip = require("../models/Trip");
const Passenger = require("../models/Passenger");
const Passenger_Trip = require("../models/Passenger_Trip")
const Path = require("../models/Path");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
const check_permission = require("../config/check_permission");
require("dotenv").config();

module.exports = {
    async getTrips(user_id) {
        console.log("teste")
        const trips = await Trip.findById(user_id).populate("passengers");
        
        return {
            trips,
            status: 200,
        };
    },

    async createTrip(gas_price, km_l, passengers, date, path, value, isOwnerIncluded, isFixedValue, owner) {
        // 
        if(isFixedValue) {

            const createdTrip = await Trip.create({
                date,
                path,
                passengers,
                value,
                isOwnerIncluded,
                isFixedValue,
                owner,
                gas_price,
                km_l
            })
            
            passengers.forEach(async element => {
                const passenger_find = await Passenger.findById({ _id: element._id });

                let history_trips = new Array();
                let currentDebt = passenger_find.debt;
                currentDebt += element.price;
                
                const passenger_trips = await Passenger_Trip.create({
                    passenger_id: element._id,
                    trip_id: createdTrip._id,
                    user: owner,
                    value,
                    hasPaid,
                    date
                })

                console.log(passenger_trips)

                history_trips = passenger_find.carpoolHistory;
                history_trips.push(createdTrip._id);

                const passengerUpdate = await Passenger.findOneAndUpdate({_id: element._id},{ carpoolHistory: history_trips}, {new: true}); 
                console.log(passengerUpdate)

            });

            const trip = await Trip.findById( createdTrip._id ).populate("passengers").populate("path");

            return { trips: trip, status: 200 };
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
                owner,
                gas_price,
                km_l
            })

            passengers.forEach(async element => {
                const passenger_find = await Passenger.findById({ _id: element._id });
                let history_trips = new Array();
                let currentDebt = passenger_find.debt;
                currentDebt += element.price;
                
                history_trips = passenger_find.carpoolHistory;
                history_trips.push(createdTrip._id);

                const passenger_trips = await Passenger_Trip.create({
                    passenger_id: element._id,
                    trip_id: createdTrip._id,
                    user: owner,
                    value,
                    date
                })

                console.log(passenger_trips)

                const passengerUpdate = await Passenger.findOneAndUpdate({_id: element._id},{ carpoolHistory: history_trips}, {new: true}); 
            });

            let arr = [];
            const trip_list = await Trip.find({ owner }).distinct('date');   
            const trips = await Trip.find({ owner }).populate("passengers").populate("path");
            
            trip_list.forEach(element => {
                let itens = []
                trips.forEach(trip_element => {
                    if(element == trip_element.date){
                        itens.push(trip_element);
                    }
                })
                arr.push({date: element, data: itens});
            });
            return { trips: arr, status: 200 };
        }   

    },

    async passengerPayment(passenger_id, value){
        try {
            const find_passenger = await Passenger.findById({ _id: passenger_id });
            let currentDebt = find_passenger.debt;
            currentDebt -= value;
            const passenger = await Passenger.findOneAndUpdate({_id: passenger_id},{ isOnDebt: false, debt: currentDebt}, {new: true});

            return {passenger: passenger, status: 200 };
            
        } catch (error) {
            return { error: "Internal server error", status: 500 };
        }

    },

    async getUserTips(owner) {
        try {
            let arr = [];
            const trip_list = await Trip.find({ owner }).distinct('date');   
            const trips = await Trip.find({ owner }).populate("passengers").populate("path");
            
            trip_list.forEach(element => {
                let itens = []
                trips.forEach(trip_element => {
                    if(element == trip_element.date){
                        itens.push(trip_element);
                    }
                })
                arr.push({date: element, data: itens});
            });

            return {
                trips: arr,
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
