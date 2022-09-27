const express = require("express");
const router = express.Router();
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models 
const UserModel = require("../models/User");    

// Controllers 
const UserController = require("../controllers/UserController");

// Middlewares 
const UserAuth = require("../middleware/UserAuth");

router.post("/verify/email", async (req, res)=> {
    const { email } = req.body;

    const result = await UserController.verifyEmail(email);
    
    return res.json( result )
})

router.post("/register", async (req, res)=> {
    const { email, password, average_consumption, fuel_per_liter } = req.body;

    const result = await UserController.createUser(email, password, average_consumption, fuel_per_liter);
    
    return res.json( result )
})

router.post("/login", async (req, res)=>{
    
    const {email, password} = req.body;
    
    const result = await UserController.login(email, password);

    return res.status(200).json({ result })

})

router.get("/get", UserAuth, async (req, res)=>{
    const Users = await UserModel.find();
    res.send(Users)
})

router.get("/users/get/:nome", UserAuth, async (req,res)=>{
    const nome = req.params.nome
    const User = await UserModel.findOne({where:{nome}});
    res.send(User);
})


router.put("/users/update/:id", UserAuth, async (req,res)=>{
    //
})

router.delete("/users/delete/:nome", UserAuth, async (req, res)=>{
    //
})
module.exports = router;