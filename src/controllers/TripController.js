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
            const path_find = await Path.findById({ _id: path });
            const user_find = await User.findById({ _id: owner._id });
            
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
                // passanger = passenger_find
                let history_trips = new Array();
                let currentDebt = passenger_find.debt;
                currentDebt += element.price;
                
                const passenger_trips = await Passenger_Trip.create({
                    passenger_id: element._id,
                    trip_id: createdTrip._id,
                    user: owner,
                    value,
                    date
                })

                console.log(passenger_trips)

                history_trips = passenger_find.carpoolHistory;
                history_trips.push(createdTrip._id);

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
        } else {       
            const path_find = await Path.findById({ _id: path });
            const user_find = await User.findById({ _id: owner._id });
            let totalValue = (path_find.totalDistance / user_find.average_consumption) * user_find.fuel_per_liter;

            const createdTrip = await Trip.create({
                date,
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

    async passengerPayment(passenger_id, trip_id){
        try {
            const passenger_trip = await Passenger_Trip.findOne({ passenger_id, trip_id })

            const updated_passenger_trip = await Passenger_Trip.findByIdAndUpdate({_id : passenger_trip._id}, { hasPaid: !passenger_trip.hasPaid }, {new: true})

            return {passenger: updated_passenger_trip, status: 200 };
            
        } catch (error) {
            return { error: "Internal server error", status: 500 };
        }

    },
    
    async payAllTrips(user_id, passenger_id){
        try {
            const found_passenger = await Passenger.findById( passenger_id);
            const permission = await permissions.checkPermission(
                user_id,
                found_passenger.owner.toString(),
                "Voc?? n??o tem permiss??o para deletar esta carona."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                try {

                    const passenger_trips = await Passenger_Trip.find({passenger_id});
            
                    passenger_trips.forEach(async (element) => {
                        const updated_passenger_trip = await Passenger_Trip.findByIdAndUpdate({_id : element._id}, { hasPaid: true }, {new: true})
                        console.log(updated_passenger_trip)
                    })
        
                    return {message: "O usu??rio teve todas as contas pagas !", status: 200 };

                } catch (error) {
                    return { message: error, status: 400 };
                }
            }
            

                    
        } catch (error) {
            return { error: "Internal server error", status: 500 };
        }
    },

    async getPassengerTripDetails(passenger_id){
        try {
            const passenger = await Passenger.findById(passenger_id).populate({path: "carpoolHistory", populate : { path : 'path' }})
            const passenger_trip = await Passenger_Trip.find({ passenger_id })

            let object = [];

            passenger.carpoolHistory.forEach(async function (element) {
                var result = passenger_trip.filter((object) => {
                    if(object.trip_id.toString() ===  element._id.toString()){
                        return object
                    }
                })
                
                if(result.length > 0){
                    object.push({name_path: element.path.title, price: element.value, data: element.date, hasPaid: result[0].hasPaid, id: result[0].trip_id})
                    const foundTrip = await Trip.findById( result[0].trip_id )
                    console.log(foundTrip)
                }

            })

            // nome do trajeto 
            // pre??o do trajeto
            // data do trajeto
            // haspaid da pessoa da carona
            // console.log(object)
            return {trip: object, status: 200 };
        } catch (error) {
            return { error: "Internal server error", status: 500 };
        }
    },
    
    async getTripDetail(trip_id){
        try {
            const passenger_trip = await Passenger_Trip.find({ trip_id }).populate("passenger_id")
            const passengers = []

            passenger_trip.forEach((element) => {
                passengers.push({name : element.passenger_id.name, hasPaid: element.hasPaid, price: element.value, _id: element.passenger_id._id, is_driver: element.passenger_id.isDriver})
            })

            return {
                trips: passengers,
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getUserTips(owner, trip_id) {
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
                "Voc?? n??o tem permiss??o para visualizar esta carona."
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
                "Voc?? n??o tem permiss??o para deletar esta carona."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                try {
                    const DeletedTrip = await Trip.findByIdAndDelete(id);
                    
                    const FinancesFix = await Passenger_Trip.find({ trip_id : trip._id });
                    FinancesFix.forEach(async (element) => {
                        const deleteFinance = await Passenger_Trip.findByIdAndDelete( element._id )
                        trip.passengers.forEach(async (element) => {
                            const deleteCarpool = await Passenger.updateOne({_id : element}, { $pullAll: {carpoolHistory: [{ _id: trip._id }]}})
                        })
                    })
                    
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
