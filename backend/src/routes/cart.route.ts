import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { addToCart, getCart } from "../controllers/cart.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { addToCartSchema } from "../validators/cart.validator";

const router = Router();

router.get("/mycart", authenticate, getCart);

router.post("/add", authenticate, validateSchema(addToCartSchema), addToCart);

export default router;
