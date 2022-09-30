const Path = require("../models/Path");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const permissions = require("../config/check_permission");
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
            return {paths, status: 200};
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getUserPaths(owner) {
        try {
            const paths = await Path.find({ owner });
            if (paths.length === 0) {
                return {
                    message: "Você ainda não cadastrou passageiros.",
                    status: 200,
                };
            } else {
                return { paths, status: 200 };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOnePath(user, id) {
        try {
            const path = await Path.findOne({ where: { id } });
            if (user != path.owner) {
                return {
                    message: "Você não tem permissão para ver",
                    status: 400,
                };
            }
            return {path, status: 200};
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
                "Você não tem permissão para editar"
            );
            if (!permission.isValid) {
                return { message: permission.message, status: 400 };
            } else {
                const UpdatedPath = await Path.findByIdAndUpdate(
                    id,
                    {
                        title,
                        totalDistance,
                    },
                    { new: true }
                );
                return {
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
                "Você não tem permissão para deletar!"
            );
            if (!permission.isValid) {
                return {
                    message: permission.message,
                    status: permission.status,
                };
            } else {
                const DeletedPath = await Path.findByIdAndDelete(id);
                return { message: "Path deletado com sucesso", status: 200 };
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
