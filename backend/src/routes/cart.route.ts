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
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.responses[200] = {
       description: "OK"
  } */

  /* #swagger.responses[404] = {
       description: "Not Found"
  } */

  getCart,
);

router.post(
  "/add",
  authenticate,
  validateSchema(addToCartSchema),
  /* #swagger.tags = ["Cart"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
       description: "Add to Cart",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/CartAddRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
       description: "Created"
  } */

  /* #swagger.responses[404] = {
       description: "Not Found"
  } */

  /* #swagger.responses[400] = {
       description: "Bad Request"
  } */

  /* #swagger.responses[409] = {
       description: "Conflict"
  } */

  /* #swagger.responses[401] = {
       description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
       description: "Forbidden"
  } */

  addToCart,
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteFromCartSchema),
  /* #swagger.tags = ["Cart"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
       description: "Delete from Cart",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/CartDeleteRequest" },
         }
       }
    } */

  /* #swagger.responses[200] = {
       description: "OK"
  } */

  /* #swagger.responses[404] = {
       description: "Not Found"
  } */

  /* #swagger.responses[400] = {
       description: "Bad Request"
  } */

  /* #swagger.responses[409] = {
       description: "Conflict"
  } */

  /* #swagger.responses[401] = {
       description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
       description: "Forbidden"
  } */

  deleteFromCart,
);

export default router;
