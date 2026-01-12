import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import addressRoutes from "./address.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/address", addressRoutes);

export default router;
