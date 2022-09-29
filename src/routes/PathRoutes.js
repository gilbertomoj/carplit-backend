const express = require("express");
const router = express.Router();

// Models
const PathModel = require("../models/Path");

// Controllers
const PathController = require("../controllers/PathController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");
const Path = require("../models/Path");

router.get("/path", (req,res)=>{
    res.send("Foi")
})

router.post("/path/create", UserAuth, async (req, res) => {
    const { title, totalDistance, driver } = req.body;

    const result = await PathController.createPath(title, totalDistance);

    return res.json(result);
});

router.get("/path/get", UserAuth, async (req, res) => {
    const result = await PathController.getPaths();
    return res.json(result);
});

router.get("/path/get/:id", UserAuth, async (req, res) => {
    const { path_id } = req;

    const Path = await PathController.getOnePath({ where: { path_id } });
    res.send(Path);
});

router.put("/path/update/:id", UserAuth, async (req, res) => {
    const path_id = req.params.id;
    const { title, totalDistance } = req.body;

    const Path = await PathController.updatePath(path_id, title, totalDistance);

    res.send(Path);
});

router.delete("/path/delete/:id", UserAuth, async (req, res) => {
    const { path_id } = req;

    const Path = await PathController.deletePath({ where: { path_id } });
    res.send(Path);
});

module.exports = router;
