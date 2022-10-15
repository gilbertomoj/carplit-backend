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
  try {
      const { email } = req.body;

      const result = await UserController.verifyEmail(email);

      return res.status(result.status).json(result);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }

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
    try {
      const { name, email, password, average_consumption, fuel_per_liter } =
      req.body;
      const result = await UserController.createUser(
          name,
          email,
          password,
          average_consumption,
          fuel_per_liter
      );
      console.log(result.status);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
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
    try {
        const { email, password } = req.body;
      
        const result = await UserController.login(email, password);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error });
    }

});

router.get("/retrieve/:id", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'retrieve user'
    #swagger.description = 'Endpoint to retrieve user'
    #swagger.path = "user/retrieve/{id}"
    */
    try {
        const id = req.params.id;
        const result = await UserModel.findOne({ where: { id } });
        return res.status(result.status).json(result.user);
    } catch (error){
        return res.status(500).json({ message: error });      
    }
});

router.put("/update", UserAuth, async (req, res) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'update user'
    #swagger.description = 'Endpoint to update user'
    #swagger.path = "user/update"
    */
   
    const user = req.user_id;

    try {
        const { name, email, average_consumption, fuel_per_liter } = req.body;
        const result = await UserController.updateUser(
          user,
          name,
          email,
          average_consumption,
          fuel_per_liter
        );
        return res.status(result.status).json(result.message);
    } catch (error){
        return res.status(500).json({ message: error });
    }

});

router.delete("/delete", UserAuth, async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.summary = 'update user'
  #swagger.description = 'Endpoint to update user'
  #swagger.path = "user/delete"
  */
  try {
    const id = req.user_id;
    const result = await UserController.deleteUser(id);
    return res.status(result.status).json(result.message);
  } catch (error){
      return res.status(500).json({ message: error });
  }
});

router.get("/recover_password", async (req, res)=>{
    try {
        const { email } = req.body;
        const result = await UserController.recoverPassword(email);
        return res.status(result.status).json(result.message); 
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})

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
