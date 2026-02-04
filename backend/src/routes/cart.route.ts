import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  addToCart,
  deleteFromCart,
  getCart,
} from "../controllers/cart.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  addToCartSchema,
  deleteFromCartSchema,
} from "../validators/cart.validator";

const router = Router();

router.get(
  "/mycart", 
  authenticate, 
  /* #swagger.tags = ["Cart"] */
  getCart);

router.post(
  "/add",
  authenticate,
  validateSchema(addToCartSchema),
  /* #swagger.tags = ["Cart"] */
  addToCart,
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteFromCartSchema),
  /* #swagger.tags = ["Cart"] */
  deleteFromCart,
);

export default router;
