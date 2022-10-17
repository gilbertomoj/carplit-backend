const Path = require("../models/Path");
const Trips = require("../models/Trip");
const Passenger = require("../models/Passenger");
const Passenger_Trip = require("../models/Passenger_Trip");
const moment = require("moment");
const { listIndexes } = require("../models/Path");


module.exports = {
    async loadFinance(owner, options) {
        try {
            let balance = [];
            var paid = 0;
            var total_cost = 0;
            const filter = moment().subtract(options, 'd').locale("pt-br").format("YYYY-MM-DD")

            const passengers = await Passenger_Trip.find({ user: owner }).populate("passenger_id");

            const findTrips = await Trips.find({ owner })

            passengers.forEach((element) => {
                var auxDate = element.date.split(", ")
                var aux = auxDate[1].split("/")
        
                if(moment(`${aux[2]}-${aux[1]}-${aux[0]}`).isSameOrAfter(filter)){
                    total_cost += element.value     
                }
            })
            
            findTrips.forEach((element) => {
                if(element.passengers.length == 0){
                    var auxDate = element.date.split(", ")
                    var aux = auxDate[1].split("/")
            
                    if(moment(`${aux[2]}-${aux[1]}-${aux[0]}`).isSameOrAfter(filter)){
                        total_cost += element.value     
                    }
                }
            })
            
            const get_passengers = await Passenger_Trip.find({ user: owner }).distinct("passenger_id").then(async (object) => {
                var result = object.map(async function(item){
                    const passenger_trip = await Passenger_Trip.find({ passenger_id: item});
                    const get_passenger = await Passenger.findById(item); // Um passageiro

                    Promise.all([passenger_trip, get_passenger]).then((values) => {
                        var debt = 0;
                        values[0].forEach((element) => {

                            var auxDate = element.date.split(", ")
                            var aux = auxDate[1].split("/")

                            if(moment(`${aux[2]}-${aux[1]}-${aux[0]}`).isSameOrAfter(filter)){
                                if( element.hasPaid ){
                                    paid += element.value; 
                                }else{
                                    debt += element.value;
                                }
                            }
                        })

                        // total_cost => total que o usuário recebeu dos passageiros
                        balance.push({ passenger: values[1].name, debt})
                    })
                    return balance
                })
                return await Promise.all(result)
            }) // Pegar cada usuário separadamente 

            // const passenger_trips = await Passenger_Trip.find({ owner }); // Pegar cada usuário separadamente 
            let diff = 0

            if(total_cost > paid){
                diff = paid
            }else{
                diff = total_cost
            }

            const object = {
                passengers: get_passengers[0],
                user_received: paid,
                total_cost,
                saved: diff,
                ride_balance: paid - total_cost 
            }
            

            return {passenger_trips: object, status: 200}

        } catch (error) {
            console.log(error)
            return { message: error, status: 400 };
        }
    },
    
    async listOnePassengerFinance(owner, passenger){
        try {
            let balance = [];
            var paid = 0;

            const passenger_obj = await Passenger.find({_id: passenger})
            
            passenger_carpools = passenger_obj.carpoolHistory
            console.log(passenger_carpools)

            // passe.forEach(async (element) => {

            // })
            // console.log(passenger_obj)
            const findTrips = await Passenger_Trip.find({ passenger_id: passenger })
            console.log(findTrips)

            // console.log(findTrips.lenght)
            // console.log(findTrips)



            // let finances = []
            // findTrips.forEach(async (element) => {
            //     const finance = await Passenger_Trip.find({passenger_id: element.passenger})
            //     // console.log(finance)
            //     finances.push(finance)
            // })
            // console.log("lista final", finances)
            // id de cada viagem
            // procurar a viagem no Passenger_Trip
            // load finance dessa viagem
            
            // return {, status: 200}
            
        } catch (error) {
            console.log(error)
            return { message: error, status: 400 };
        }
    },

    async listAll(owner){
        try {
            const passenger_trips = await Passenger_Trip.find();
            return {passenger_trips, status: 200}
        } catch (error) {
            console.log(error)
            return { message: error, status: 400 };
        }
    }
};
