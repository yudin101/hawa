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

router.get(
  "/search",
  validateSchema(searchProductSchema),
  /* #swagger.tags = ["Product"] */
  searchProduct,
);

router.get(
  "/:id", 
  validateSchema(getProductSchema),
  /* #swagger.tags = ["Product"] */
  getProduct
);

router.get(
  "/seller/:username",
  validateSchema(getSellerProductSchema),
  /* #swagger.tags = ["Product"] */
  getSellerProducts,
);

router.get(
  "/category/:category",
  validateSchema(getCategoryProductSchema),
  /* #swagger.tags = ["Product"] */
  getCategoryProducts,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(addProductSchema),
  /* #swagger.tags = ["Product"] */
  addProduct,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(updateProductSchema),
  /* #swagger.tags = ["Product"] */
  updateProduct,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(deleteProductSchema),
  /* #swagger.tags = ["Product"] */
  deleteProduct,
);

export default router;
