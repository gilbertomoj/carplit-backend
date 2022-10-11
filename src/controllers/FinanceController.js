const Path = require("../models/Path");
const Trips = require("../models/Trip");
const Passenger = require("../models/Passenger");
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
        
    }
};
