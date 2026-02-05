import { Router } from "express";
import {
  changeUserTypeSchema,
  deleteUserSchema,
  searchUserSchema,
  updateUserSchema,
  userWithUsernameSchema,
} from "../validators/user.validator";
import {
  changeUserType,
  deleteUser,
  getUser,
  searchUser,
  updateUser,
} from "../controllers/user.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { ROLES } from "../constants/roles";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = Router();

router.get(
  "/search/seller",
  validateSchema(searchUserSchema),

  // #swagger.tags = ["User"]

  /* #swagger.parameters["username"] = {
      in: "query",
      description: "Seller to find",
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

  searchUser,
);

router.get(
  "/:username",
  validateSchema(userWithUsernameSchema),

  /* #swagger.tags = ["User"] */

  /* #swagger.parameters["username"] = {
      in: "path",
      description: "Username",
      required: true,
      type: "string",
      example: "yudin101"
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

  getUser,
);

router.patch(
  "/update",
  authenticate,
  validateSchema(updateUserSchema),
  /* #swagger.tags = ["User"] */

  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
     description: "User Update",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserUpdateRequest" },
         example: {
          id: "1",
           username: "yudin101",
           email: "yudin101@example.com",
           newPassword: "password345",
           confirmNewPassword: "password345",
           phoneNumber: "9800000000",
           addressId: "1",
           confirmationPassword: "password123"
        }
       }
     }
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

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  updateUser,
);

router.patch(
  "/upgrade/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */

  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
     description: "User Upgrade to Admin",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserChangeDeleteRequest" },
         example: {
          id: "1",
          confirmationPassword: "password123"
        }
       }
     }
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

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  changeUserType(ROLES.ADMIN),
);

router.patch(
  "/upgrade/seller",
  authenticate,
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */

  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
     description: "User Upgrade to Seller",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserChangeDeleteRequest" },
         example: {
          id: "1",
          confirmationPassword: "password123"
        }
       }
     }
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

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  changeUserType(ROLES.SELLER),
);

router.patch(
  "/downgrade/customer",
  authenticate,
  validateSchema(changeUserTypeSchema),
  /* #swagger.tags = ["User"] */

  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
     description: "User Downgrade to Customer",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserChangeDeleteRequest" },
         example: {
          id: "1",
          confirmationPassword: "password123"
        }
       }
     }
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

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  changeUserType(ROLES.CUSTOMER),
);

router.delete(
  "/delete",
  authenticate,
  validateSchema(deleteUserSchema),
  /* #swagger.tags = ["User"] */

  /* #swagger.auto = false */

  /* #swagger.security = [{ "bearerAuth": [] }] */

  /* #swagger.requestBody = {
     description: "User Delete",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserChangeDeleteRequest" },
         example: {
          id: "1",
          confirmationPassword: "password123"
        }
       }
     }
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

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  deleteUser,
);

export default router;
