const express = require("express");
const router = express.Router();

// Models
const PathModel = require("../models/Path");

// Controllers
const PathController = require("../controllers/PathController");

// Middlewares
const UserAuth = require("../middleware/UserAuth");
const Path = require("../models/Path");

router.post("/create", UserAuth, async (req, res) => {
    const { title, totalDistance } = req.body;

    const result = await PathController.createPath(title, totalDistance);

    return res.json(result);
});

router.get("/get", UserAuth, async (req, res) => {
    const result = await PathController.getPaths();
    return res.json(result);
});

router.get("/get/:id", UserAuth, async (req, res) => {
    const { path_id } = req;

    const Path = await PathController.getOnePath({ where: { path_id } });
    res.send(Path);
});

router.put("/update/:id", UserAuth, async (req, res) => {
    const path_id = req.params.id;
    const { title, totalDistance } = req;

    const Path = await PathController.updatePath({
        where: { path_id },
        $set: { title, totalDistance },
    });
    res.send(Path);
});

router.delete("/delete/:id", UserAuth, async (req, res) => {
    const { path_id } = req;

    const Path = await PathController.deletePath({ where: { path_id } });
    res.send(Path);
});

module.exports = router;
