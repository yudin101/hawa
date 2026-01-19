import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getCart } from "../controllers/cart.controller";

const router = Router()

router.get("/mycart", authenticate, getCart);

export default router
