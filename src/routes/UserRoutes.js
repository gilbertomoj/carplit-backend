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

router.post("verify/email", async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to verify if given email already exist.'
        #swagger.path = "user/verify/email"
        #swagger.requestBody = {
        "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "example": "test@carplit.com"
                  }
                }
              }
            }
          }
    }*/
    const { email } = req.body;

    const result = await UserController.verifyEmail(email);

    return res.json(result);
});

router.post("/register", async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to register a user' 
        #swagger.path = "user/register"*/
    const { name, email, password, average_consumption, fuel_per_liter } =
        req.body;

    const result = await UserController.createUser(
        name,
        email,
        password,
        average_consumption,
        fuel_per_liter
    );

    return res.json(result);
});

router.post("/login", async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to login'
        #swagger.path = "user/login"*/
    const { email, password } = req.body;

    const result = await UserController.login(email, password);
    return res.json(result);
});

router.post("/trips/create", UserAuth, async (req, res) => {
    const { title, driver, passengers, total_distance, data } = req.body;
    const result = await TripController.createTrips(
        title,
        driver,
        passengers,
        total_distance,
        data
    );
    // Pegar as trips apenas do usuário logado
    return res.json(result);
});

router.get("/trips/get", UserAuth, async (req, res) => {
    const { user_id } = req;

    const result = await TripController.getTrips(user_id);
    // Pegar as trips apenas do usuário logado
    return res.json(result);
});

router.post("/trips/create", UserAuth, async (req, res) => {
    const { title, driver, passangers, totalDistance, data } = req.body;

    const result = await TripController.createTrips(
        title,
        driver,
        passangers,
        totalDistance,
        data
    );
    // Pegar as trips apenas do usuário logado
    return res.json(result);
});

router.get("user/paths/get", UserAuth, async (req, res) => {
    const { user_id } = req;

    const result = await PathController.getUserPaths(user_id);
    // Pegar as trips apenas do usuário logado
    return res.json(result);
});

router.get("/get", UserAuth, async (req, res) => {
    /*  
    #swagger.tags = ['User']
    #swagger.description = 'Endpoint to get all users'
    #swagger.path = "user/get"
    */
    const result = await UserModel.find();
    return res.json(result);
});

router.get("/users/get/:nome", UserAuth, async (req, res) => {
    const nome = req.params.nome;
    const User = await UserModel.findOne({ where: { nome } });
    res.send(User);
});

router.get("/users/get/:id", UserAuth, async (req, res) => {
    const id = req.params.id;
    const User = await UserModel.findOne({ where: { id } });
    res.send(User);
});

router.put("users/update/:id", UserAuth, async (req, res) => {
    const id = req.params.id;
    const obj = req.body;
    const result = await UserController.updateUser(id, obj);

    return res.json(result);
});

router.delete("/users/delete/:nome", UserAuth, async (req, res) => {
    //
});

module.exports = router;
