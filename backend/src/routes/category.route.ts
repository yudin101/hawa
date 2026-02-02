import { Router } from "express";
import {
  addCategorySchema,
  deleteCategorySchema,
  searchCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  addCategory,
  deleteCategory,
  searchCategory,
  updateCategory,
} from "../controllers/category.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { authenticate } from "../middlewares/authenticate.middleware";
import { categoryTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.get(
  "/search",
  validateSchema(searchCategorySchema),
  categoryTag,
  searchCategory,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(addCategorySchema),
  categoryTag,
  addCategory,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(updateCategorySchema),
  categoryTag,
  updateCategory,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(deleteCategorySchema),
  categoryTag,
  deleteCategory,
);

export default router;
