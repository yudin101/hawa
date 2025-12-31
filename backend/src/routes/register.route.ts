import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/customer", registerUser);

router.post("/seller", registerUser);

router.post("/admin", authenticate, checkAdmin, registerUser);

export default router;
