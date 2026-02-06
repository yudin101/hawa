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

router.get(
  "/search",
  validateSchema(searchAddressSchema),
  /* #swagger.tags = ["Address"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["searchTerm"] =  {
     in: "query",
     description: "District, Municipality or Street Name",
     required: false,
     type: "string",
     example: "Kathmandu"
  } */

  /* #swagger.parameters["page"] = {
      in: "query",
      description: "Page number",
      required: false,
      type: "integer",
      example: 1
  } */

  /* #swagger.parameters["limit"] = {
      in: "query",
      description: "Items per page",
      required: false,
      type: "integer",
      example: 10
  } */

  /* #swagger.responses[200] = {
      description: "OK"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  searchAddress,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(addAddressSchema),
  /* #swagger.tags = ["Address"] */
  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
       description: "Add Address",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/AddressAddRequest" },
        }
      }
  } */

  /* #swagger.responses[201] = {
    description: "Created"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[403] = {
    description: "Forbidden"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  addAddress,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(updateAddressSchema),
  /* #swagger.tags = ["Address"] */
  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
       description: "Update Address",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/AddressUpdateRequest" },
        }
      }
  } */

  /* #swagger.responses[200] = {
    description: "OK"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[403] = {
    description: "Forbidden"
  } */

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  updateAddress,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(deleteAddressSchema),
  /* #swagger.tags = ["Address"] */
  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
       description: "Delete Address",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/AddressDeleteRequest" },
          }
        }
      }
  } */

  /* #swagger.responses[200] = {
    description: "OK"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[403] = {
    description: "Forbidden"
  } */

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */
  deleteAddress,
);

export default router;
