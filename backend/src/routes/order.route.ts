import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  getOrders,
  getSellerOrders,
  placeOrder,
  cancelOrder,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  cancelOrderSchema,
  getOrdersSchema,
  placeOrderSchema,
} from "../validators/order.validator";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get(
  "/seller/orders",
  authenticate,
  checkRole(ROLES.SELLER),
  validateSchema(getOrdersSchema),
  getSellerOrders,
);

router.get(
  "/myorders",
  authenticate,
  validateSchema(getOrdersSchema),
  getOrders,
);

router.post("/new", authenticate, validateSchema(placeOrderSchema), placeOrder);

router.patch(
  "/cancel",
  authenticate,
  validateSchema(cancelOrderSchema),
  cancelOrder,
);

export default router;
