import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middleware";
import { registerSchema } from "../validators/auth.validator";
import { ROLES } from "../constants/roles";

const router = Router();

router.post(
  "/customer",
  checkSchema(registerSchema),
  validate,
  registerUser(ROLES.CUSTOMER),
);

router.post(
  "/seller",
  checkSchema(registerSchema),
  validate,
  registerUser(ROLES.SELLER),
);

router.post(
  "/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(registerSchema),
  validate,
  registerUser(ROLES.ADMIN),
);

export default router;
