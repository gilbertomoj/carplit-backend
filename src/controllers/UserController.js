const User = require("../models/User");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
require("dotenv").config();

module.exports = {
    async createUser(
        name,
        email,
        password,
        average_consumption,
        fuel_per_liter
    ) {
        try {
            const findUser = await User.findOne({ email });
            if (findUser) {
                return { error: "Email já cadastrado" };
            } else {
                const user = await User.create({
                    name,
                    email,
                    password: bcript.hashSync(password, 8),
                    average_consumption,
                    fuel_per_liter,
                });
                const token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400,
                });
                return { token, status: 200 };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async verifyEmail(email) {
        try {
            const user = await User.findOne({ email });
            if (user) {
                return { error: "Usuário já cadastrado", status: 400 };
            } else {
                return { status: 200 };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async login(email, password) {
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return { message: "Credenciais fornecidas inválidas", status: 400 };
        } else {
            const passwordMatch = await bcript.compare(
                password,
                userExists.password
            );

            if (!passwordMatch) {
                return {
                    message: "Credenciais fornecidas inválidas",
                    status: 400,
                };
            } else {
                const token = jwt.sign({ id: userExists.id }, config.secret, {
                    expiresIn: 86400,
                });
                average_consumption = userExists.average_consumption
                fuel_per_liter = userExists.fuel_per_liter
                return { average_consumption, fuel_per_liter, token, status: 200 };
            }
        }
    },
    async getUsers() {
        // ROTA ADMIN
        try {
            const users = await User.find();
            return {
                users,
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOneUser(email) {
        try {
            const user = await User.findOne({ where: { email } });
            return {
                user,
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async updateUser(id, average_consumption, fuel_per_liter) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id, 
                {
                    average_consumption, 
                    fuel_per_liter,
                },
                { new: true }
            ); 
            return {
                updatedUser,
                message: "Usuario atualizado com sucesso",
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deleteUser(id) {
        try {
            console.log(id);
            const DeletedUser = await User.findByIdAndDelete(id);
            return {
                DeletedUser,
                message: "Usuário deletado com sucesso",
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async recoverPassword(email){
        console.log(email)
    }
};
