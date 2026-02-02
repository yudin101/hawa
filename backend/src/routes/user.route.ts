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
import { userTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.get(
  "/search/seller",
  validateSchema(searchUserSchema),
  userTag,
  searchUser,
);

router.get(
  "/:username",
  validateSchema(userWithUsernameSchema),
  userTag,
  getUser,
);

router.patch(
  "/update",
  authenticate,
  validateSchema(updateUserSchema),
  userTag,
  updateUser,
);

router.patch(
  "/upgrade/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(changeUserTypeSchema),
  userTag,
  changeUserType(ROLES.ADMIN),
);

router.patch(
  "/upgrade/seller",
  authenticate,
  validateSchema(changeUserTypeSchema),
  userTag,
  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  validateSchema(changeUserTypeSchema),
  userTag,
  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteUserSchema),
  userTag,
  deleteUser,
);

export default router;
