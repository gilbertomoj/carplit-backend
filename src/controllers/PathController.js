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
        try {
            const Paths = await Path.find();
            return Paths;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
    async getUserPaths(user_id) {
        try {
            const paths = await Path.findById(user_id);
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
    async updatePath(id, title, totalDistance) {
        try {
            const UpdatedPath = await Path.findByIdAndUpdate(
                id,
                {
                    title,
                    totalDistance,
                },
                { new: true }
            );
            return UpdatedPath;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },

    async deletePath(id) {
        try {
            const DeletedPath = await Path.deleteOne({ where: { id } });
            return DeletedPath;
        } catch (error) {
            return { message: error, status: 400 };
        }
    },
};
