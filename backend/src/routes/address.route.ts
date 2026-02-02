import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  addAddress,
  deleteAddress,
  searchAddress,
  updateAddress,
} from "../controllers/address.controller";
import {
  addAddressSchema,
  deleteAddressSchema,
  searchAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator";
import { addressTag } from "../middlewares/swaggerTags.middleware";

const router = Router();

router.get(
  "/search",
  validateSchema(searchAddressSchema),
  addressTag,
  searchAddress,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(addAddressSchema),
  addressTag,
  addAddress,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(updateAddressSchema),
  addressTag,
  updateAddress,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(deleteAddressSchema),
  addressTag,
  deleteAddress,
);

export default router;
