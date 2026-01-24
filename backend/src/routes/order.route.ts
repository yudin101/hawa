import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  getOrders,
  placeOrder,
  cancelOrder,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  cancelOrderSchema,
  getOrdersSchema,
} from "../validators/order.validator";

const router = Router();

router.get(
  "/myorders",
  validateSchema(getOrdersSchema),
  authenticate,
  getOrders,
);

// router.post("/new", validateSchema(), placeOrder);

router.patch(
  "/cancel",
  validateSchema(cancelOrderSchema),
  authenticate,
  cancelOrder,
);

export default router;
