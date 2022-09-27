const User = require("../models/User");

module.exports = {
    async createUser(email, password){
        try{
            const NewUser = await User.create({
                email,
                password
            })
            return NewUser;
        } catch (error){
            return {message: error, status: 400}
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
