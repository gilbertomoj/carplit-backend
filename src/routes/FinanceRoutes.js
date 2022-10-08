const express = require("express");
const router = express.Router();

// Models
const UserModel = require("../models/User");
// Controllers
const UserController = require("../controllers/UserController");
const TripController = require("../controllers/TripController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");
const PathController = require("../controllers/PathController");

router.get("/list", async (req, res )=>{
    try {
        const user_id = req;
        console.log(user_id);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;
