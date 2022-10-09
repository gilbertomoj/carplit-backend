const express = require("express");
const router = express.Router();
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const PathModel = require("../models/Path");
const UserModel = require("../models/User");
const TripModel = require("../models/Trip");

// Controllers
const PathController = require("../controllers/PathController");
const TripController = require("../controllers/TripController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");
const Path = require("../models/Path");

router.get("/list", UserAuth, async (req, res) => {
    /*  
        #swagger.tags = ['Trip']
        #swagger.summary = 'list user trips'
        #swagger.description = 'Endpoint to list user trips'
        #swagger.path = "trip/list"
    */

    const user = req.user_id;
    const result = await TripController.getUserTips(user);

    return res.status(result.status).json(result.trips);
});

// ROTA NAO FINALIZADA

router.post("/create", UserAuth, async (req, res) => {
/*  
        #swagger.tags = ['Trip']
        #swagger.description = 'Endpoint to create a trip'
        #swagger.path = "trip/create"
    */
    try {
        const owner = await UserModel.findOne({ _id: req.user_id });
        const { passengers, path, date, value, isOwnerIncluded, isFixedValue  } = req.body;
        const result = await TripController.createTrip(
            passengers, 
            date,
            path, 
            value, 
            isOwnerIncluded, 
            isFixedValue,
            owner
        );
    
        return res.status(result.status).json(result.trips);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }

});

router.put("/passenger/payment/:id", async (req, res) => {
    /*  
        #swagger.tags = ['Trip']
        #swagger.summary = 'passenger payment'
        #swagger.description = 'Endpoint to pay a passenger'
        #swagger.path = "trip/passenger/payment"
    */
    try {
        const id = req.params.id;
        const result = await TripController.passengerPayment(id);
        return res.status(result.status).json(result.passenger);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"});
    }
});

router.get("/admin/list", UserAuth, async (req, res) => {
    /*  
        #swagger.tags = ['Admin']
        #swagger.summary = 'list all trips'
        #swagger.description = 'Endpoint to list alls trips'
        #swagger.path = "trip/admin/list"
    */

    const result = await TripController.getTrips();

    return res.status(result.status).json(result.trips);
});

module.exports = router;
