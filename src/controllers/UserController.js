const User = require("../models/User");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {
    async createUser(email, password){
        try{
            const user = await User.findOne({email});
            if (!user) {
                const newUser = await User.create({
                    email,
                    password: bcript.hashSync(password, 8)
                })
                return newUser;
            } else {
                return {error: "Usuário já cadastrado"}
            }
        } catch (error){
            return {message: error, status: 400}
        }
    },
    async login(email, password){
        const userExists = await User.findOne({email});
        if (!userExists){ 
            return {message: "Credenciais fornecidas inválidas", status: 400}
        } else {

            const passwordMatch = await bcript.compare(password, userExists.password);

            if (!passwordMatch){
                return {message: "Credenciais fornecidas inválidas", status: 400}
            } else {
                const token = jwt.sign({id: userExists.id}, config.secret, {
                    expiresIn: 86400
                })
                return {token, status: 200}
            }
        }
    },
    async getUsers(){
        try{
            const Users = await User.find();
            return Users;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async getOneUser(email){
        try{
            const User = await User.findOne({where:{email}});
            return User;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async updateUser(id){
        try{
            const UpdatedUser = await User.updateOne({where:{id}}, {$set:{
                email,
                password,
            }});
            return UpdatedUser;
        } catch (error){
            return {message: error, status: 400}
        }
    },

    async deleteUser( id) {
        try{
            const DeletedUser = await User.deleteOne({where:{id}});
            return DeletedUser;
        } catch (error){
            return {message: error, status: 400}
        }
    }
}
