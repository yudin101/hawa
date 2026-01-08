import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.post("/customer", registerUser(ROLES.CUSTOMER));

router.post("/seller", registerUser(ROLES.SELLER));

router.post(
  "/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  registerUser(ROLES.ADMIN),
);

export default router;
