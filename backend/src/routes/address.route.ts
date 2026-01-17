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

const router = Router();

router.get("/search", validateSchema(searchAddressSchema), searchAddress);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(addAddressSchema),
  addAddress,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(updateAddressSchema),
  updateAddress,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(deleteAddressSchema),
  deleteAddress,
);

export default router;
