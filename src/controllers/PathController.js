const Path = require("../models/Path");

const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
const check_permission = require("../config/check_permission");
const Trip = require("../models/Trip");
require("dotenv").config();

module.exports = {
    async createPath(title, totalDistance, owner) {
        try {
            const path = await Path.create({
                title,
                totalDistance,
                owner,
            });

            return { path, status: 200 };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getPaths() {
        // Rota para uso do admin !!!!!
        try {
            const paths = await Path.find();
            return { paths, status: 200 };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getUserPaths(owner) {
        try {
            const paths = await Path.find({ owner });
            return { paths, status: 200 };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOnePath(user, id) {
        try {
            const path = await Path.findById(id);
            const permission = await permissions.checkPermission(
                user,
                path.owner,
                "Você não tem permissão para visualizar este caminho."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            }
            return {
                path,
                message: "Caminho recuperado com sucesso",
                status: 200,
            };
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async updatePath(user, id, title, totalDistance) {
        try {
            const path = await Path.findById(id);
            const permission = await permissions.checkPermission(
                user,
                path.owner,
                "Você não tem permissão para editar este caminho."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                const updatedPath = await Path.findByIdAndUpdate(
                    id,
                    {
                        title,
                        totalDistance,
                    },
                    { new: true }
                );
                return {
                    updatedPath,
                    message: "Caminho atualizado com sucesso",
                    status: 200,
                };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deletePath(user, id) {
        try {
            const path = await Path.findById(id);
            const permission = await permissions.checkPermission(
                user,
                path.owner,
                "Você não tem permissão para deletar este caminho."
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                const foundPath = await Trip.findOne({ path: path._id })
                if(foundPath){
                    return {
                        message: "Não pode deletar, está sendo usado por uma carona",
                        status: 403,
                    };
                } else {
                    const deletedPath = await Path.findByIdAndDelete(id);
                    return {
                        message: "Caminho deletado com sucesso",
                        status: 200,
                    };
                }

            }
        } catch (error) {
            return {
                message: error,
                status: 400,
            };
        }
    },
};
