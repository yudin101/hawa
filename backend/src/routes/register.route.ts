import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateSchema } from "../middlewares/validation.middleware";
import { registerSchema } from "../validators/auth.validator";
import { ROLES } from "../constants/roles";

const router = Router();

router.post(
  "/customer",
  validateSchema(registerSchema),
  registerUser(ROLES.CUSTOMER),
);

router.post(
  "/seller",
  validateSchema(registerSchema),
  registerUser(ROLES.SELLER),
);

router.post(
  "/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(registerSchema),
  registerUser(ROLES.ADMIN),
);

export default router;
