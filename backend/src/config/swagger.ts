import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Hawa API",
    description: "E-commerce API",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.ts", "../controllers/auth.controller.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
