import { Router } from "express";
import {
  addProductSchema,
  getProductSchema,
  searchProductSchema,
  deleteProductSchema,
  updateProductSchema,
  getSellerProductSchema,
  getCategoryProductSchema,
} from "../validators/product.validator";
import {
  addProduct,
  getProduct,
  getSellerProducts,
  searchProduct,
  deleteProduct,
  updateProduct,
  getCategoryProducts,
} from "../controllers/product.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";

const router = Router();

router.get(
  "/search",
  validateSchema(searchProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["searchTerm"] =  {
     in: "query",
     description: "Name, Category or Seller Username",
     required: false,
     type: "string",
     example: "Tshirt"
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

  searchProduct,
);

router.get(
  "/:id", 
  validateSchema(getProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["id"] = {
     in: "path",
     description: "Product ID",
     required: true,
     type: "string",
     example: "3"
    } */

  /* #swagger.responses[200] = {
      description: "OK"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  getProduct
);

router.get(
  "/seller/:username",
  validateSchema(getSellerProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["username"] = {
     in: "path",
     description: "Seller Username",
     required: true,
     type: "string",
     example: "yudin101"
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

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  getSellerProducts,
);

router.get(
  "/category/:category",
  validateSchema(getCategoryProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */

  /* #swagger.parameters["category"] = {
     in: "path",
     description: "Product Category",
     required: true,
     type: "string",
     example: "yudin101"
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

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */
  getCategoryProducts,
);

router.post(
  "/add",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(addProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/
  
  /* #swagger.requestBody = {
       description: "Add Product",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/ProductAddRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
      description: "Created"
  } */

  /* #swagger.responses[401] = {
      description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
      description: "Forbidden"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */
  addProduct,
);

router.patch(
  "/update",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(updateProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/
  
  /* #swagger.requestBody = {
       description: "Update Product",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/ProductUpdateRequest" },
         }
       }
    } */

  /* #swagger.responses[200] = {
      description: "OK"
  } */

  /* #swagger.responses[401] = {
      description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
      description: "Forbidden"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */
  updateProduct,
);

router.delete(
  "/delete",
  authenticate,
  checkRole(ROLES.SELLER, ROLES.ADMIN),
  validateSchema(deleteProductSchema),
  /* #swagger.tags = ["Product"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  
  /* #swagger.requestBody = {
      description: "Delete Product",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ProductDeleteRequest" },
        }
      }
  } */

  /* #swagger.responses[200] = {
      description: "OK"
  } */

  /* #swagger.responses[401] = {
      description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
      description: "Forbidden"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  deleteProduct,
);

export default router;
