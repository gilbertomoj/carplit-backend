const express = require("express");
const router = express.Router();
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const PassengerModel = require("../models/Passenger");
const UserModel = require("../models/User");

// Controllers
const PassengerController = require("../controllers/PassengerController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");

router.get("/list", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'list user passenger'
        #swagger.description = 'Endpoint to list user passengers'
        #swagger.path = "passenger/list"
    */

    const user = req.user_id;
    const result = await PassengerController.getUserPassengers(user);

    return res.status(result.status).json(result.passengers);
});

router.post("/create", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'register passenger'
        #swagger.description = 'Endpoint to create a passenger'
        #swagger.path = "passenger/create"
        #swagger.requestBody = {
        "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "example": "Frodo Baggins"
                  },
                  "address": {
                    "example": "Shire, 13"
                  }
                }
              }
            }
          }
    }
    */

    const owner = await UserModel.findOne({ _id: req.user_id });

    const { name, address } = req.body;
    const result = await PassengerController.createPassenger(
        name,
        address,
        owner._id
    );

    return res.status(result.status).json(result);
});

router.get("/retrieve/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'retrieve passenger'
        #swagger.description = 'Endpoint to list user passengers'
        #swagger.path = "passenger/retrieve/{id}"
    */

    const user = req.user_id;
    const passenger_id = req.params.id;
    const result = await PassengerController.getOnePassenger(
        user,
        passenger_id
    );

    return res.status(result.status).json(result.passenger);
});

router.put("/update/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'update passenger'
        #swagger.description = 'Endpoint to update a passenger'
        #swagger.path = "passenger/update/{id}"
    */

    const user = req.user_id;
    const passenger_id = req.params.id;
    const { name, address } = req.body;

    const result = await PassengerController.updatePassenger(
        user,
        passenger_id,
        name,
        address
    );

    return res.status(result.status).json(result.updatedPassenger);
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'delete passenger'
        #swagger.description = 'Endpoint to delete a passenger'
        #swagger.path = "passenger/delete/{id}"
    */
    const user = req.user_id;
    const passenger_id = req.params.id;

    const result = await PassengerController.deletePassenger(
        user,
        passenger_id
    );

    return res.status(result.status).json(result.deletedPassenger);
});

router.put("/payment-all/:id", UserAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user_id;
        
        const result = await PassengerController.updateAllDebts(user, id);

        return res.status(result.status).json(result);
    
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

router.get("/admin/list", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Admin']
        #swagger.summary = 'list all passengers'
        #swagger.description = 'Endpoint to list all passengers'
        #swagger.path = "passenger/admin/list"
    */
    const result = await PassengerController.getPassengers();

    return res.status(result.status).json(result.passengers);
});

module.exports = router;
