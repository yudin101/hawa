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
import { productTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.get(
  "/search",
  validateSchema(searchProductSchema),
  productTag,
  searchProduct,
);

router.get("/:id", validateSchema(getProductSchema), productTag, getProduct);

router.get(
  "/seller/:username",
  validateSchema(getSellerProductSchema),
  productTag,
  getSellerProducts,
);

router.get(
  "/category/:category",
  validateSchema(getCategoryProductSchema),
  productTag,
  getCategoryProducts,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(addProductSchema),
  productTag,
  addProduct,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(updateProductSchema),
  productTag,
  updateProduct,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(deleteProductSchema),
  productTag,
  deleteProduct,
);

export default router;
