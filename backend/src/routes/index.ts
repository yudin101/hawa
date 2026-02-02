import { Router } from "express";
import docsRoute from "./swagger.route"
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import addressRoutes from "./address.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";
import cartRoutes from "./cart.route";
import orderRoutes from "./order.route";

const router = Router();

router.use("/docs", docsRoute);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/address", addressRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

export default router;
