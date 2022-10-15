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
const Trip = require("../models/Trip");

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

router.get("/get/:detail", UserAuth, async (req,res)=>{
    try {
        const trip_id = req.params.detail
        const result = await TripController.getTripDetail(trip_id)

        return res.status(result.status).json(result.trips);

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.post("/create", UserAuth, async (req, res) => {
/*  
        #swagger.tags = ['Trip']
        #swagger.description = 'Endpoint to create a trip'
        #swagger.path = "trip/create"
    */
    try {
        const owner = await UserModel.findOne({ _id: req.user_id });
        const { gas_price, km_l, passengers, path, date, value, isOwnerIncluded, isFixedValue  } = req.body;
        const result = await TripController.createTrip(
            gas_price,
            km_l,
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

router.post("/payall/", UserAuth, async (req,res)=>{
    try {
        const passenger_id = req.body.passenger_id;
        const user = req.user_id;
        // const passenger_id = req.params.passenger_id;

        const result = await TripController.payAllTrips(user, passenger_id);

        return res.status(result.status).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/carpool/passenger/:passenger_id", async(req,res) => {
    try {
        const passenger_id = req.params.passenger_id;
        
        const result = await TripController.getPassengerTripDetails(passenger_id);

        return res.status(result.status).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.put("/passenger/payment/", async (req, res) => {
    /*  
        #swagger.tags = ['Trip']
        #swagger.summary = 'passenger payment'
        #swagger.description = 'Endpoint to pay a passenger'
        #swagger.path = "trip/passenger/payment/{ìd}"
    */
    try {
        const { passenger_id, trip_id } = req.body;

        const result = await TripController.passengerPayment(passenger_id, trip_id);
        return res.status(result.status).json(result);
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
