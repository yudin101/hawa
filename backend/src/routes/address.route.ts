import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middleware";
import { addAddress, deleteAddress, updateAddress } from "../controllers/address.controller";
import {
  addAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator";

const router = Router();

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(addAddressSchema),
  validate,
  addAddress,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(updateAddressSchema),
  validate,
  updateAddress,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  checkSchema(deleteAddressSchema),
  validate,
  deleteAddress,
);

export default router;
