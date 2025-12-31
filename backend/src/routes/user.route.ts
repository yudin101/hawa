import { Router } from "express";
import { checkSchema } from "express-validator";
import { searchUserValidation } from "../validators/user.validator";
import { searchUser } from "../controllers/users.controller";
import { validate } from "../middlewares/validation.middleware";

const router = Router();

router.get("/search", checkSchema(searchUserValidation), validate, searchUser);

export default router;
