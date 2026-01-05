import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  changeUserTypeValidation,
  deleteUserValidation,
  searchUserValidation,
  updateUserValidation,
  userWithUsernameValidation,
} from "../validators/user.validator";
import {
  changeUserType,
  deleteUser,
  getUser,
  searchUser,
  updateUser,
} from "../controllers/users.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get("/search", checkSchema(searchUserValidation), validate, searchUser);

router.get(
  "/:username",
  checkSchema(userWithUsernameValidation),
  validate,
  getUser,
);

router.patch(
  "/update",
  authenticate,
  checkSchema(updateUserValidation),
  validate,
  updateUser,
);

router.patch(
  "/upgrade/seller",
  authenticate,
  checkSchema(changeUserTypeValidation),
  validate,
  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  checkSchema(changeUserTypeValidation),
  validate,
  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  checkSchema(deleteUserValidation),
  validate,
  deleteUser,
);

export default router;
