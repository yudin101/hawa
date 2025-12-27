import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/customer", validate, registerUser);

router.post("/seller", validate, registerUser);

router.post("/admin", authenticate, checkAdmin, validate, registerUser);

export default router;
