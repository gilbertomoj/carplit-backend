const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = [
    "src/routes/UserRoutes.js",
    "src/routes/PathRoutes.js",
    "src/routes/PassengerRoutes.js",
    // Adicionar caminho das futuras rotas
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require("src/server.js");
});
