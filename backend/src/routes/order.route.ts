import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  getOrders,
  getSellerOrders,
  placeOrder,
  setOrderStatus,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  setOrderStatusSchema,
  getOrdersSchema,
  placeOrderSchema,
} from "../validators/order.validator";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { OSTATUS } from "../constants/orderStatus";

const router = Router();

router.get(
  "/seller/orders",
  authenticate,
  checkRole(ROLES.SELLER),
  validateSchema(getOrdersSchema),
  /* #swagger.tags = ["Order"] */
  getSellerOrders,
);

router.get(
  "/myorders",
  authenticate,
  validateSchema(getOrdersSchema),
  /* #swagger.tags = ["Order"] */
  getOrders,
);

router.post(
  "/new",
  authenticate,
  validateSchema(placeOrderSchema),
  /* #swagger.tags = ["Order"] */
  placeOrder,
);

router.patch(
  "/shipping",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  setOrderStatus(OSTATUS.SHIPPING),
);

router.patch(
  "/delivered",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  setOrderStatus(OSTATUS.DELIVERED),
);

router.patch(
  "/cancel",
  authenticate,
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  setOrderStatus(OSTATUS.CANCELLED),
);

export default router;
