import { Router } from "express";
import registerRoutes from "./register.route";
import { checkSchema } from "express-validator";
import {
  loginValidation,
  registerValidation,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";

const router = Router();

router.use("/register", checkSchema(registerValidation), registerRoutes);

router.post("/login", checkSchema(loginValidation), validate, loginUser);

router.post("/refresh", refreshToken);

router.post("/logout", authenticate, logoutUser);

export default router;
