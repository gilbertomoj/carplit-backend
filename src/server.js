const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../swagger.json");

const app = express();
const PORT = process.env.PORT || 8080;

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
const router = require("./routes/UserRoutes");

// Rotas
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.all("/api");
app.use("/user", userRoutes);
app.use("", passengerRoutes);
app.use("", pathRoutes);

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT} 🚀`);
});
