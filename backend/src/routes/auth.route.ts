import { Router } from "express";
import registerRoutes from "./register.route";
import { loginSchema, refreshTokenSchema } from "../validators/auth.validator";
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";

const router = Router();

router.use("/register", registerRoutes);

router.post(
  "/login",
  validateSchema(loginSchema),

  // #swagger.tags = ["Auth"]

  /* #swagger.requestBody = {
      description: "User Login",
      required: true,
      content: { 
        "application/json": {
          schema: { $ref: "#/components/schemas/UserLoginRequest" },
          example: {
            username: "yudin101",
            password: "password123"
          }
        }
      }
  } */

  /* #swagger.responses[200] = {
    description: "OK"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  loginUser,
);

router.post(
  "/refresh",
  validateSchema(refreshTokenSchema),

  // #swagger.tags = ["Auth"]

  // #swagger.security = [{ "refreshTokenAuth": [] }]

  /* #swagger.responses[200] = {
    description: "OK"
  } */

  /* #swagger.responses[403] = {
    description: "Forbidden"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  refreshToken,
);

router.post(
  "/logout",
  authenticate,
  validateSchema(refreshTokenSchema),

  // #swagger.tags = ["Auth"]
  // #swagger.auto = false
  // #swagger.security = [{ "bearerAuth": [] }, { "refreshTokenAuth": [] }]

  /* #swagger.responses[200] = {
    description: "OK"
  } */

  logoutUser,
);

export default router;
