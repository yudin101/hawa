import { Router } from "express";
import {
  addProductSchema,
  getProductSchema,
  searchProductSchema,
  deleteProductSchema,
  updateProductSchema,
  getSellerProductSchema,
  getCategoryProductSchema,
} from "../validators/product.validator";
import {
  addProduct,
  getProduct,
  getSellerProducts,
  searchProduct,
  deleteProduct,
  updateProduct,
  getCategoryProducts,
} from "../controllers/product.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get("/search", validateSchema(searchProductSchema), searchProduct);

router.get("/:id", validateSchema(getProductSchema), getProduct);

router.get(
  "/seller/:username/",
  validateSchema(getSellerProductSchema),
  getSellerProducts,
);

router.get(
  "/category/:category/",
  validateSchema(getCategoryProductSchema),
  getCategoryProducts,
);

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
