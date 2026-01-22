import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { addToCart, deleteFromCart, getCart } from "../controllers/cart.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { addToCartSchema, deleteFromCartSchema } from "../validators/cart.validator";

const router = Router();

router.get("/mycart", authenticate, getCart);

router.post("/add", authenticate, validateSchema(addToCartSchema), addToCart);

router.delete("/delete", authenticate, validateSchema(deleteFromCartSchema), deleteFromCart);

export default router;
