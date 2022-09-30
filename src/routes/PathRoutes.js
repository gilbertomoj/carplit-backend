const express = require("express");
const router = express.Router();

// Models
const PathModel = require("../models/Path");
const UserModel = require("../models/User");

// Controllers
const PathController = require("../controllers/PathController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");
const Path = require("../models/Path");

router.post("/create", UserAuth, async (req, res) => {
    /*  
    #swagger.tags = ['Path']
    #swagger.description = 'Endpoint to register a path'
    #swagger.path = "path/create"
    #swagger.requestBody = {
        "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": {
                    "example": "Casa - UFPE"
                  },
                  "totalDistance": {
                    "example": 16
                  }
                }
              }
            }
          }
    }
    */

    const owner = await UserModel.findOne({ _id: req.user_id });

    const { title, totalDistance } = req.body;
    const result = await PathController.createPath(
        title,
        totalDistance,
        owner._id
    );
    const formatedResult = {
        title: result.path.title,
        totalDistance: result.path.totalDistance,
        owner: {
            name: owner.name,
            id: owner._id,
        },
    };
    return res.json( formatedResult );
});

router.get("/get", UserAuth, async (req, res) => {

    const user = req.user_id;

    const result = await PathController.getUserPaths(user);

    return res.json(result);
});

router.get("/get/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Path']
        #swagger.description = 'Endpoint to retrieve a path'
        #swagger.path = "path/get/:id"*/

    const { path_id } = req;

    const Path = await PathController.getOnePath({ where: { path_id } });
    res.send(Path);
});

router.put("/update/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Path']
        #swagger.description = 'Endpoint to update a path'
        #swagger.path = "path/update/:id"*/
    const user = req.user_id;
    const path_id = req.params.id;
    const { title, totalDistance } = req.body;
    const Path = await PathController.updatePath(user, path_id, title, totalDistance);
    console.log("sadas")
    return res.status(403).json( Path );
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Path']
        #swagger.description = 'Endpoint to delete a path'
        #swagger.path = "path/delete/:id"*/
    const user = req.user_id;
    const path_id = req.params.id;

    const Path = await PathController.deletePath(user, path_id);

    return res.status(Path.status).json( Path );
});

module.exports = router;
