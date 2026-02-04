import swaggerAutogenInit from "swagger-autogen";
import { UserLoginRequest, UserRegisterRequest } from "./schemas/auth.swagger";

const swaggerAutogen = swaggerAutogenInit({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Hawa API",
    description: "E-commerce API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      refreshTokenAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token"
      }
    },
    schemas: {
      UserLoginRequest: UserLoginRequest,
      UserRegisterRequest: UserRegisterRequest,
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
