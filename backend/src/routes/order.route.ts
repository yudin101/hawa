import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  getOrders,
  placeOrder,
  cancelOrder,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getOrdersSchema } from "../validators/order.validator";

const router = Router();

router.get(
  "/myorders",
  validateSchema(getOrdersSchema),
  authenticate,
  getOrders,
);

// router.post("/new", validateSchema(), placeOrder);

// router.post("/cancel", validateSchema(), cancelOrder);

export default router;
