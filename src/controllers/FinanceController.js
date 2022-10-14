const Path = require("../models/Path");
const Trips = require("../models/Trip");
const Passenger = require("../models/Passenger");
const Passenger_Trip = require("../models/Passenger_Trip");
const moment = require("moment")


module.exports = {
    async loadFinance(user, options) {
        try {

            const filter = this.getFilter(options)
            console.log(filter)
            const trips = await Trips.find({owner: user})
            let filteredTrips = []
            trips.forEach((element) => {
                console.log(element.date > filter)
            })

            const passenger = await Passenger.find({owner: user})

            let filteredPassengers = [];
            passenger.forEach((element) => {
                if(element.debt > 0){
                    filteredPassengers.push(element)
                }
            })

            return { filteredPassengers, status: 200 };
        } catch (error) {
            console.log(error)
            return { message: error, status: 400 };
        }
    },

    getFilter(options){
        let filter = '';
        if(options == 1){
            filter = moment().subtract(999, 'y').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }else if(options == 2){
            filter = moment().subtract(7, 'd').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }else if(options == 3){
            filter = moment().subtract(15, 'd').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }else if(options == 4){
            filter = moment().subtract(30, 'd').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }else if(options == 5){
            filter = moment().subtract(6, 'm').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }else if(options == 6){
            filter = moment().subtract(1, 'y').locale("pt-br").format('dddd, DD/MM/YYYY')
            return filter
        }
    },

    async passenger_trip(owner){
        try {
            let balance = [];
            var paid = 0;

            const get_passengers = await Passenger_Trip.find({ owner }).distinct("passenger_id").then(async (object) => {
                var result = object.map(async function(item){
                    const passenger_trip = await Passenger_Trip.find({ passenger_id: item});
                    const get_passenger = await Passenger.findById(item); // Um passageiro
                    Promise.all([passenger_trip, get_passenger]).then((values) => {
                        var debt = 0;
                        values[0].forEach((element) => {
                            const date = "sexta, 08/07/2022"
                            if(element.date >= date){
                                if( element.hasPaid ){
                                    paid += element.value; 
                                }else{
                                    debt += element.value;
                                }
                            }
                        })
                        balance.push({ passenger: values[1].name, debt})
                    })
                    return balance
                })
                return await Promise.all(result)
            }) // Pegar cada usuário separadamente 
            // const passenger_trips = await Passenger_Trip.find({ owner }); // Pegar cada usuário separadamente 

            const object = {
                passengers: get_passengers[0],
                user_received: paid,
            }
            
            return {passenger_trips: object, status: 200}
        } catch (error) {
            console.log(error)
            return { message: error, status: 400 };
        }
    }
};
