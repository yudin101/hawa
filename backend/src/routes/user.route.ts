import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  deleteUserValidation,
  searchUserValidation,
  updateUserValidation,
} from "../validators/user.validator";
import {
  deleteUser,
  searchUser,
  updateUser,
} from "../controllers/users.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get("/search", checkSchema(searchUserValidation), validate, searchUser);

router.post(
  "/update",
  authenticate,
  checkSchema(updateUserValidation),
  validate,
  updateUser,
);

router.delete(
  "/delete",
  authenticate,
  checkSchema(deleteUserValidation),
  validate,
  deleteUser,
);

export default router;
