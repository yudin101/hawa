import { Router } from "express";
import { checkSchema } from "express-validator";
import { registerUser } from "../controllers/auth.controller";
import { registerValidation } from "../validators/auth.validator";
import { validate } from "../middlewares/validation.middleware";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post(
  "/customer",
  checkSchema(registerValidation),
  validate,
  registerUser,
);

router.post(
  "/seller",
  checkSchema(registerValidation),
  validate,
  registerUser,
);

router.post(
  "/admin",
  authenticate,
  checkAdmin,
  checkSchema(registerValidation),
  validate,
  registerUser,
);

export default router;
