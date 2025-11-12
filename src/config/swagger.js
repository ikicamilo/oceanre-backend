// src/config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

// Read environment variables with fallbacks
const PORT = process.env.PORT || 4000;
const BASE_PATH = process.env.API_BASE_PATH || "/api";
const SERVER_URL = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OceanRe Accounting - Sales API",
      version: "1.0.0",
      description: "Backend API documentation with JWT authentication.",
    },
    servers: [
      {
        url: `${SERVER_URL}${BASE_PATH}`,
        description: `${process.env.NODE_ENV || "development"} server`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: 'Provide your JWT token without "Bearer " prefix',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    "./src/domains/**/*.routes.js",
    "./src/domains/**/*.controller.js",
    "./src/auth/**/*.routes.js",
    "./src/auth/**/*.controller.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`✅ Swagger UI available at ${SERVER_URL}${BASE_PATH}/docs`);
}

module.exports = setupSwagger;
