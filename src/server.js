const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// Configuração
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Conexão com mongoose
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Import de models
const UserModel = require("./models/User");
const PassengerModel = require("./models/Passenger");
const PathModel = require("./models/Path");

// Inicialização das rotas
const userRoutes = require("./routes/UserRoutes");
const passengerRoutes = require("./routes/PassengerRoutes");
const pathRoutes = require("./routes/PathRoutes");

// Rotas
app.use("/user", userRoutes);
app.use("/passenger", passengerRoutes);
app.use("/path", pathRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Rodando");
});
