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

router.post("/login", validateSchema(loginSchema), loginUser);

router.post("/refresh", validateSchema(refreshTokenSchema), refreshToken);

router.post(
  "/logout",
  authenticate,
  validateSchema(refreshTokenSchema),
  logoutUser,
);

export default router;
