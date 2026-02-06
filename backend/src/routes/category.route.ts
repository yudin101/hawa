import { Router } from "express";
import {
  addCategorySchema,
  deleteCategorySchema,
  searchCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  addCategory,
  deleteCategory,
  searchCategory,
  updateCategory,
} from "../controllers/category.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get(
  "/search",
  validateSchema(searchCategorySchema),
  /* #swagger.tags = ["Category"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["searchTerm"] =  {
     in: "query",
     description: "Catrgory Name",
     required: false,
     type: "string",
     example: "Electronics"
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
  searchCategory,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(addCategorySchema),
  /* #swagger.tags = ["Category"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Add Category",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/CategoryAddRequest" },
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

  addCategory,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(updateCategorySchema),
  /* #swagger.tags = ["Category"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Update Category",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/CategoryUpdateRequest" },
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

  updateCategory,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(deleteCategorySchema),
  /* #swagger.tags = ["Category"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Delete Category",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/CategoryDeleteRequest" },
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

  deleteCategory,
);

export default router;
