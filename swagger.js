const options = {
    openapi: "3.0.2",
};

const swaggerAutogen = require("swagger-autogen")(options);

const doc = {
    info: {
        title: "Carplit REST API",
        version: "1.0.0",
        description:
            "A REST API built with Express and MongoDB. This API provides a way to organize your carpools, paths, passengers and finances.",
    },
    basePath: "/",
    servers: [
        {
            url: "http://localhost:8080",
            description: "Local server",
        },
        {
            url: "http://carplit-backend.herokuapp.com",
            description: "Main server",
        },
    ],
    tags: [
        {
            name: "user",
            description: "Operations about user",
        },
        {
            name: "path",
            description: "Operations about path",
        },
        {
            name: "passenger",
            description: "Operations about passenger",
        },
    ],
};
const outputFile = "./swagger.json";
const endpointsFiles = [
    "src/routes/UserRoutes.js",
    "src/routes/PathRoutes.js",
    "src/routes/PassengerRoutes.js",
    // Adicionar caminho das futuras rotas
];

swaggerAutogen(outputFile, endpointsFiles, doc);
