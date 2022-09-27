const express = require("express");
const router = express.Router();
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models 
const UserModel = require("../models/User");    

// Controllers 
const UserController = require("../controllers/UserController");

router.get("/", (req, res)=>{
    res.json({
        message: "Deploy realizado"
    })
})

router.post("/register", async (req, res)=> {
    const { email, password } = req.body;

    const newUser = await UserController.createUser(email, password);
    
    res.send(newUser);
})

router.post("/login", async (req, res)=>{
    
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});

    return res.status(200).json({ email, password })

})

router.get("/get", async (req, res)=>{
    const Users = await UserModel.find();
    res.send(Users)
})

router.get("/users/get/:nome",async (req,res)=>{
    const nome = req.params.nome
    const User = await UserModel.findOne({where:{nome}});
    res.send(User);
})

router.post("/users/post", async (req, res)=>{
    const { nome, idade, estado_civil } = req.body;
    const NewUser = await UserModel.create({
        nome,
        idade,
        estado_civil
    })
    res.send(NewUser);
})

router.put("/users/update/:id", async (req,res)=>{
    const id = req.params.id;
    const { nome, idade, estado_civil } = req.body;
    const UpdatedUser = await UserModel.updateOne({where:{id}}, {$set:{
        nome,
        idade,
        estado_civil
    }});
    res.json({message: "Usuário modificado", UpdatedUser})
})

router.delete("/users/delete/:nome", async (req, res)=>{
    const nome = req.params.nome
    const DeletedUser = await UserModel.deleteOne({where:{nome}})
    res.json({message: "Usuário deletado", DeletedUser})
})
module.exports = router;