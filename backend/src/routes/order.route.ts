import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  getOrders,
  getSellerOrders,
  placeOrder,
  setOrderStatus,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  setOrderStatusSchema,
  getOrdersSchema,
  placeOrderSchema,
} from "../validators/order.validator";
import { checkRole } from "../middlewares/checkRole.middleware";
import { ROLES } from "../constants/roles";
import { OSTATUS } from "../constants/orderStatus";

const router = Router();

router.get(
  "/seller/orders",
  authenticate,
  checkRole(ROLES.SELLER),
  validateSchema(getOrdersSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

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

  /* #swagger.responses[401] = {
      description: "Unauthorized"
  } */

  /* #swagger.responses[403] = {
    description: "Forbidden"
  } */
  getSellerOrders,
);

router.post(
  "/myorders",
  authenticate,
  validateSchema(getOrdersSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Your Orders",
       required: false,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/GetMyOrdersRequest" },
         }
       }
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

  /* #swagger.responses[401] = {
      description: "Unauthorized"
  } */
  getOrders,
);

router.post(
  "/new",
  authenticate,
  validateSchema(placeOrderSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Place New Order",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/OrderPlaceRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
      description: "Created"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Forbidden"
  } */
  placeOrder,
);

router.patch(
  "/shipping",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Change Order Status to Shipping",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/OrderStatusRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
      description: "Created"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Forbidden"
  } */
  setOrderStatus(OSTATUS.SHIPPING),
);

router.patch(
  "/delivered",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Change Order Status to Delivered",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/OrderStatusRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
      description: "Created"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Forbidden"
  } */
  setOrderStatus(OSTATUS.DELIVERED),
);

router.patch(
  "/cancel",
  authenticate,
  validateSchema(setOrderStatusSchema),
  /* #swagger.tags = ["Order"] */
  /* #swagger.auto = false */
  /* #swagger.security = [{ "bearerAuth": [] }]*/

  /* #swagger.requestBody = {
       description: "Change Order Status to Cancelled",
       required: true,
       content: {
         "application/json": {
           schema: { $ref: "#/components/schemas/OrderStatusRequest" },
         }
       }
    } */

  /* #swagger.responses[201] = {
      description: "Created"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[401] = {
    description: "Unauthorized"
  } */

  /* #swagger.responses[404] = {
      description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Forbidden"
  } */
  setOrderStatus(OSTATUS.CANCELLED),
);

export default router;
