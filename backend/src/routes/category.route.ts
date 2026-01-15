import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  addCategorySchema,
  deleteCategorySchema,
  searchCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";
import { validate } from "../middlewares/validation.middleware";
import {
  addCategory,
  deleteCategory,
  searchCategory,
  updateCategory,
} from "../controllers/category.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get(
  "/search",
  checkSchema(searchCategorySchema),
  validate,
  searchCategory,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(addCategorySchema),
  validate,
  addCategory,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(updateCategorySchema),
  validate,
  updateCategory,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(deleteCategorySchema),
  validate,
  deleteCategory,
);

export default router;
