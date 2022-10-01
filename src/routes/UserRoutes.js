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
                    "example": "sauron@gmail.com"
                  }
                }
              }
            }
          }
        }
    */
    const { email } = req.body;

    const result = await UserController.verifyEmail(email);

    return res.status(result.status).json(result);
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
                    "example": "Galadriel"
                  },
                  "email": {
                    "example": "galadriel@gmail.com"
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

    return res.status(result.status).json(result);
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
                    "example": "bilbo@gmail.com"
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
    return res.status(result.status).json(result);
});

router.get("/retrieve/:id", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'retrieve user'
    #swagger.description = 'Endpoint to retrieve user'
    #swagger.path = "user/retrieve/{id}"
    */
    const id = req.params.id;
    const result = await UserModel.findOne({ where: { id } });
    return res.status(result.status).json(result.user);
});

router.put("/update/:id", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'update user'
    #swagger.description = 'Endpoint to update user'
    #swagger.path = "user/update/{id}"
    */

    // FIX -> TEM QUE ENVIAR DUAS VEZES ANTES DE REALMENTE EDITAR!
    const id = req.params.id;
    const obj = req.body;
    const result = await UserController.updateUser(id, obj);
    return res.status(result.status).json(result.updatedUser);
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    /*
  #swagger.tags = ['User']
  #swagger.summary = 'update user'
  #swagger.description = 'Endpoint to update user'
  #swagger.path = "user/update/{id}"
  */
    const id = req.user_id;
    const result = await UserController.deleteUser(id);

    return res.status(result.status).json(result.message);
});

router.get("/admin/list", UserAuth, async (req, res) => {
    /*
  #swagger.tags = ['Admin']
  #swagger.summary = 'list all users'
  #swagger.description = 'Endpoint to list all users'
  #swagger.path = "user/admin/list"
  */
    const result = await UserController.getUsers();
    return res.status(result.status).json(result.users);
});

module.exports = router;
