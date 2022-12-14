const express = require("express");
const router = express.Router();
const moment = require("moment")
// Models
const UserModel = require("../models/User");
// Controllers
const UserController = require("../controllers/UserController");
const TripController = require("../controllers/TripController");
const FinanceController = require("../controllers/FinanceController");
// Middlewares
const UserAuth = require("../middleware/UserAuth");
const PathController = require("../controllers/PathController");

router.get("/list/:days", UserAuth, async (req, res )=>{
    /*  #swagger.tags = ['Finance']
        #swagger.summary = 'list user passenger'
        #swagger.description = 'Endpoint to list user finance'
        #swagger.path = "finance/list"
    */
    try {
        const options = req.params.days;
        const user = req.user_id;
        const result = await FinanceController.loadFinance(user, options);
        // return res.status(result.status).json(result)
        return res.status(result.status).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})
router.get("/pt", UserAuth, async (req, res )=>{
    try {
        const user = req.user_id;
        const result = await FinanceController.listAll(user);
        // return res.status(result.status).json(result)
        return res.status(result.status).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/get/:days", UserAuth, async (req, res )=>{
    /*  #swagger.tags = ['Finance']
        #swagger.summary = 'list user passenger'
        #swagger.description = 'Endpoint to list user finance'
        #swagger.path = "finance/get/{days}"
    */
    try {
        const days = req.params.days;
        const user = req.user_id;
        const result = await FinanceController.loadFinance(user, days);
        // return res.status(result.status).json(result)
        return res.status(result.status).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;
