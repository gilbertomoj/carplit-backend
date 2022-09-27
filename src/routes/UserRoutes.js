const express = require("express");
const router = express.Router();

// Models
const UserModel = require("../models/User");

// Controllers
const UserController = require("../controllers/UserController");
const TripController = require("../controllers/TripController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");

router.post("/verify/email", async (req, res) => {
    const { email } = req.body;

    const result = await UserController.verifyEmail(email);

    return res.json(result);
});

router.post("/register", async (req, res) => {
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
    const { email, password } = req.body;

    const result = await UserController.login(email, password);

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

router.get("/get", UserAuth, async (req, res) => {
    const result = await UserModel.find();
    return res.json(result);
});

router.get("/users/get/:nome", UserAuth, async (req, res) => {
    const nome = req.params.nome;
    const User = await UserModel.findOne({ where: { nome } });
    res.send(User);
});

router.put("/users/update/:id", UserAuth, async (req, res) => {
    //
});

router.delete("/users/delete/:nome", UserAuth, async (req, res) => {
    //
});

module.exports = router;
