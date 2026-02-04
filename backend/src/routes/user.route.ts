import { Router } from "express";
import {
  changeUserTypeSchema,
  deleteUserSchema,
  searchUserSchema,
  updateUserSchema,
  userWithUsernameSchema,
} from "../validators/user.validator";
import {
  changeUserType,
  deleteUser,
  getUser,
  searchUser,
  updateUser,
} from "../controllers/user.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { ROLES } from "../constants/roles";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = Router();

router.get(
  "/search/seller",
  validateSchema(searchUserSchema),
  /* #swagger.tags = ["User"] */
  searchUser,
);

router.get(
  "/:username",
  validateSchema(userWithUsernameSchema),
  /* #swagger.tags = ["User"] */
  getUser,
);

router.patch(
  "/update",
  authenticate,
  validateSchema(updateUserSchema),
  /* #swagger.tags = ["User"] */
  updateUser,
);

router.patch(
  "/upgrade/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */
  changeUserType(ROLES.ADMIN),
);

router.patch(
  "/upgrade/seller",
  authenticate,
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */
  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */
  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteUserSchema),
  /* #swagger.tags = ["User"] */
  deleteUser,
);

export default router;
