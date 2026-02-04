import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger/swagger-output.json";
import { Router } from "express";

const router = Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default router;
