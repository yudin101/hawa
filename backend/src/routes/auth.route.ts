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
import { authTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.use("/register", registerRoutes);

router.post("/login", validateSchema(loginSchema), authTag, loginUser);

router.post("/refresh", validateSchema(refreshTokenSchema), authTag, refreshToken);

router.post(
  "/logout",
  authenticate,
  validateSchema(refreshTokenSchema),
  authTag,
  logoutUser,
);

export default router;
