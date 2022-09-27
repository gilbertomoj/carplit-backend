const Passenger = require("../models/Passenger");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {
    async createPassenger(name, address){
        try {
            const passenger = await Passenger.create({
                name,
                address
            })
            
            return {passenger, status: 200};

        } catch (error){
            return {message: error, status: 400}
        }
    },

    async getPassengers(){
        try {
            const Passengers = await Passenger.find();
            return Passengers;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async getOnePassenger(id){
        try {
            const Passenger = await Passenger.findOne({where:{id}});
            return Passenger;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async updatePassenger(id){
        try {
            const name = "Nome da pessoa"
            const UpdatedPassenger = await Passenger.updateOne({where:{id}}, {$set:{
                name,
                address,
            }});
            return UpdatedPassenger;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async deletePassenger(id) {
        try {
            const DeletedPassenger = await Passenger.deleteOne({where:{id}});
            return DeletedPassenger;
        } catch (error){
            return {message: error, status: 400}
        }
    }
}
