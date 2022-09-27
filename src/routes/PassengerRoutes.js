const express = require("express");
const router = express.Router();
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models 
const PassengerModel = require("../models/Passenger");    

// Controllers 
const PassengerController = require("../controllers/PassengerController");

// Middlewares 
const UserAuth = require("../middleware/UserAuth");

router.post("/create", UserAuth, async (req, res) => {
    const { name, address } = req.body;

    const result = await PassengerController.createPassenger(name, address);

    return res.json( result )
})
module.exports = router;