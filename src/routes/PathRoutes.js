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
    console.log(result);
    return res.json(result);
});

router.get("/get", UserAuth, async (req, res) => {
    /*  
    #swagger.tags = ['Path']
    #swagger.description = 'Endpoint to get all paths'
    #swagger.path = "path/get"*/

    const result = await PathController.getPaths();
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

    const path_id = req.params.id;
    const { title, totalDistance } = req.body;

    const Path = await PathController.updatePath(path_id, title, totalDistance);

    res.send(Path);
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    /*  #swagger.tags = ['Path']
        #swagger.description = 'Endpoint to delete a path'
        #swagger.path = "path/delete/:id"*/

    const { path_id } = req;

    const Path = await PathController.deletePath({ where: { path_id } });
    res.send(Path);
});

module.exports = router;
