import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  searchUserValidation,
  updateUserValidation,
} from "../validators/user.validator";
import { searchUser, updateUser } from "../controllers/users.controller";
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

export default router;
