import { Router } from "express";
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
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get("/search", validateSchema(searchProductSchema), searchProduct);

router.get("/:id", validateSchema(getProductSchema), getProduct);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(addProductSchema),
  addProduct,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(updateProductSchema),
  updateProduct,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(deleteProductSchema),
  deleteProduct,
);

export default router;
