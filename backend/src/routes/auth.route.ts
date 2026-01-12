import { Router } from "express";
import registerRoutes from "./register.route";
import { checkSchema } from "express-validator";
import {
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";

const router = Router();

router.use(
  "/register",
  registerRoutes,
);

router.post("/login", checkSchema(loginSchema), validate, loginUser);

router.post("/refresh", checkSchema(refreshTokenSchema), refreshToken);

router.post(
  "/logout",
  authenticate,
  checkSchema(refreshTokenSchema),
  validate,
  logoutUser,
);

export default router;
