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

router.post("/verify/email", async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.summary = 'verify email'
        #swagger.description = 'Endpoint to verify if given email already exist.'
        #swagger.path = "user/verify/email"
        #swagger.requestBody = {
        "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "example": "user@carplit.com"
                  }
                }
              }
            }
          }
        }
    */
    const { email } = req.body;

    const result = await UserController.verifyEmail(email);

    return res.json(result);
});

router.post("/register", async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.summary = 'register user'
        #swagger.description = 'Endpoint to register a user' 
        #swagger.path = "user/register"
        #swagger.requestBody = {
           "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "example": "Carlit"
                  },
                  "email": {
                    "example": "user@carplit.com"
                  },
                  "password": {
                    "example": "test@123"
                  },
                  "average_consumption": {
                    "example": 2.5
                  },
                  "fuel_per_liter": {
                    "example": 12
                  }
                }
              }
            }
          }
        }
        
    */
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
        #swagger.summary = 'login user'
        #swagger.description = 'Endpoint to login'
        #swagger.path = "user/login"
        #swagger.requestBody = {
            "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "example": "user@carplit.com"
                  },
                  "password": {
                    "example": "test@123"
                  }
                }
              }
            }
          }
        }
    */

    const { email, password } = req.body;

    const result = await UserController.login(email, password);
    return res.json(result);
});

// router.post("/trips/create", UserAuth, async (req, res) => {
//     const { title, driver, passengers, total_distance, data } = req.body;
//     const result = await TripController.createTrips(
//         title,
//         driver,
//         passengers,
//         total_distance,
//         data
//     );
//     // Pegar as trips apenas do usuário logado
//     return res.json(result);
// });

// router.get("/trips/get", UserAuth, async (req, res) => {
//     const { user_id } = req;

//     const result = await TripController.getTrips(user_id);
//     // Pegar as trips apenas do usuário logado
//     return res.json(result);
// });

// router.post("/trips/create", UserAuth, async (req, res) => {
//     const { title, driver, passangers, totalDistance, data } = req.body;

//     const result = await TripController.createTrips(
//         title,
//         driver,
//         passangers,
//         totalDistance,
//         data
//     );
//     // Pegar as trips apenas do usuário logado
//     return res.json(result);
// });

// router.get("user/paths/get", UserAuth, async (req, res) => {
//     const { user_id } = req;

//     const result = await PathController.getUserPaths(user_id);
//     // Pegar as trips apenas do usuário logado
//     return res.json(result);
// });

// router.get("/users/get/:nome", UserAuth, async (req, res) => {
//     const nome = req.params.nome;
//     const User = await UserModel.findOne({ where: { nome } });
//     res.send(User);
// });

router.get("/retrieve/:id", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'retrieve user'
    #swagger.description = 'Endpoint to retrieve user'
    #swagger.path = "user/retrieve/{id}"
    */
    const id = req.params.id;
    const User = await UserModel.findOne({ where: { id } });
    res.send(User);
});

router.put("/update/:id", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'update user'
    #swagger.description = 'Endpoint to update user'
    #swagger.path = "user/update/{id}"
    */
    const id = req.params.id;
    const obj = req.body;
    const result = await UserController.updateUser(id, obj);

    return res.json(result);
});

// router.delete("/delete/:id", UserAuth, async (req, res) => {
//     /*
//     #swagger.tags = ['User']
//     #swagger.summary = 'delete user'
//     #swagger.description = 'Endpoint to delete user'
//     #swagger.path = "user/delete/{id}"
//     */
// });

router.get("/admin/list", UserAuth, async (req, res) => {
    /*
  #swagger.tags = ['Admin']
  #swagger.summary = 'list all users'
  #swagger.description = 'Endpoint to list all users'
  #swagger.path = "user/admin/list"
  */
    const result = await UserController.getUsers();
    return res.json(result);
});

module.exports = router;
