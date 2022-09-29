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
        #swagger.path = "passenger/get"
    */

    const user = req.user_id;
    const result = await PassengerController.getUserPassengers(user);

    return res.json(result);
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

    return res.json(result);
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

    return res.json(result);
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

    const Passenger = await PassengerController.updatePassenger(
        user,
        passenger_id,
        name,
        address
    );

    res.send(Passenger);
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Passenger']
        #swagger.summary = 'delete passenger'
        #swagger.description = 'Endpoint to delete a passenger'
        #swagger.path = "passenger/delete/{id}"
    */

    const user = req.user_id;
    const passenger_id = req.params.id;

    const Passenger = await PassengerController.deletePassenger({
        where: { passenger_id },
    });

    res.send(Passenger);
});

module.exports = router;
