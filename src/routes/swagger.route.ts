import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger/swagger-output.json";
import { Router } from "express";

const router = Router();

const options = {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js",
  ],
};

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

export default router;
