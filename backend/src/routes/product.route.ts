import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  addProductSchema,
  getProductSchema,
  searchProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "../validators/product.validator";
import {
  addProduct,
  getProduct,
  searchProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get(
  "/search",
  checkSchema(searchProductSchema),
  validate,
  searchProduct,
);

router.get("/:id", checkSchema(getProductSchema), validate, getProduct);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  checkSchema(addProductSchema),
  validate,
  addProduct,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  checkSchema(updateProductSchema),
  validate,
  updateProduct,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  checkSchema(deleteProductSchema),
  validate,
  deleteProduct,
);

export default router;
