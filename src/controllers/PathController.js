const Path = require("../models/Path");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
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
            const Paths = await Path.find();
            return Paths;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
    async getUserPaths(owner) {
        try {
            const paths = await Path.find({owner});
            return paths;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async getOnePath(id) {
        try {
            const Path = await Path.findOne({ where: { id } });
            return Path;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async updatePath(user, id, title, totalDistance) {
        try {
            const path = await Path.findById(id);
            if (user != path.owner) {
                return { message: "Você não tem permissão para editar", status: 400 };
            } else {
                const UpdatedPath = await Path.findByIdAndUpdate(
                    id,
                    {
                        title,
                        totalDistance,
                    },
                    { new: true }
                );
                return UpdatedPath;
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deletePath(user, id) {
        try {
            const path = await Path.findById(id);
            if (user != path.owner) {
                return { message: "Você não tem permissão para deletar", status: 400 };
            } else {
                const DeletedPath = await Path.findByIdAndDelete(id);
                return { message: "Path deletado com sucesso", status: 200 };;
            }
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
