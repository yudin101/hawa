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
import { cartTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.get("/mycart", authenticate, cartTag, getCart);

router.post(
  "/add",
  authenticate,
  validateSchema(addToCartSchema),
  cartTag,
  addToCart,
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteFromCartSchema),
  cartTag,
  deleteFromCart,
);

export default router;
