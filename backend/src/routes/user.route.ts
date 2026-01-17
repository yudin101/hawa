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

router.get("/search/seller", validateSchema(searchUserSchema), searchUser);

router.get("/:username", validateSchema(userWithUsernameSchema), getUser);

router.patch(
  "/update",
  authenticate,
  validateSchema(updateUserSchema),
  updateUser,
);

router.patch(
  "/upgrade/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(changeUserTypeSchema),
  changeUserType(ROLES.ADMIN),
);

router.patch(
  "/upgrade/seller",
  authenticate,
  validateSchema(changeUserTypeSchema),
  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  validateSchema(changeUserTypeSchema),
  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteUserSchema),
  deleteUser,
);

export default router;
