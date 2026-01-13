import { Router } from "express";
import { checkSchema } from "express-validator";
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
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { ROLES } from "../constants/roles";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = Router();

router.get("/seller/search", checkSchema(searchUserSchema), validate, searchUser);

router.get(
  "/:username",
  checkSchema(userWithUsernameSchema),
  validate,
  getUser,
);

router.patch(
  "/update",
  authenticate,
  checkSchema(updateUserSchema),
  validate,
  updateUser,
);

router.patch(
  "/upgrade/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(changeUserTypeSchema),
  validate,
  changeUserType(ROLES.ADMIN),
);

router.patch(
  "/upgrade/seller",
  authenticate,
  checkSchema(changeUserTypeSchema),
  validate,
  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  checkSchema(changeUserTypeSchema),
  validate,
  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  checkSchema(deleteUserSchema),
  validate,
  deleteUser,
);

export default router;
