const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
require('dotenv').config();

// Configuração
app.use(express.json())
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conexão com mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})

// Import de models
const UserModel = require("./models/User")

app.get("/users/get", async (req, res)=>{
    const Users = await UserModel.find();
    res.send(Users)
})

app.get("/users/get/:nome",async (req,res)=>{
    const nome = req.params.nome
    const User = await UserModel.findOne({where:{nome}});
    res.send(User)
})

app.post("/users/post", async (req, res)=>{
    const { nome, idade, estado_civil } = req.body;
    const NewUser = await UserModel.create({
        nome,
        idade,
        estado_civil
    })
    res.send(NewUser)
})

app.put("/users/update/:id", async (req,res)=>{
    const id = req.params.id;
    const { nome, idade, estado_civil } = req.body;
    const UpdatedUser = await UserModel.updateOne({where:{id}}, {$set:{
        nome,
        idade,
        estado_civil
    }})
    res.json({message: "Usuário modificado", UpdatedUser})
})

app.delete("/users/delete/:nome", async (req, res)=>{
    const nome = req.params.nome
    const DeletedUser = await UserModel.deleteOne({where:{nome}})
    res.json({message: "Usuário deletado", DeletedUser})
})
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log("Rodando")
})