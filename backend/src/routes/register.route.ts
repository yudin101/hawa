import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { checkRole } from "../middlewares/checkRole.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateSchema } from "../middlewares/validation.middleware";
import { registerSchema } from "../validators/auth.validator";
import { ROLES } from "../constants/roles";

const router = Router();

router.post(
  "/customer",
  validateSchema(registerSchema),
  // #swagger.tags = ["Auth"]

  // #swagger.auto = false

  /* #swagger.requestBody = {
     description: "Customer Register",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserRegisterRequest" },
         example: {
           username: "yudin101",
           email: "yudin101@example.com",
           password: "password123",
           confirmPassword: "password123",
           phoneNumber: "9800000000",
           addressId: "1"
         }
       }
     }
    } */

  /* #swagger.responses[201] = {
    description: "OK"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  registerUser(ROLES.CUSTOMER),
);

router.post(
  "/seller",
  validateSchema(registerSchema),
  // #swagger.tags = ["Auth"]

  // #swagger.auto = false

  /* #swagger.requestBody = {
     description: "Customer Register",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserRegisterRequest" },
         example: {
           username: "yudin101",
           email: "yudin101@example.com",
           password: "password123",
           confirmPassword: "password123",
           phoneNumber: "9800000000",
           addressId: "1"
         }
       }
     }
    } */

  /* #swagger.responses[201] = {
    description: "OK"
  } */

  /* #swagger.responses[400] = {
    description: "Bad Request"
  } */

  /* #swagger.responses[404] = {
    description: "Not Found"
  } */

  /* #swagger.responses[409] = {
    description: "Conflict"
  } */

  registerUser(ROLES.SELLER),
);

router.post(
  "/admin",
  authenticate,
  checkRole(ROLES.ADMIN),
  validateSchema(registerSchema),
  // #swagger.tags = ["Auth"]
  // #swagger.auto = false

  // #swagger.security = [{ "bearerAuth": [] }]

  /* #swagger.requestBody = {
     description: "Admin Register",
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/UserRegisterRequest" },
         example: {
           username: "yudin101",
           email: "yudin101@example.com",
           password: "password123",
           confirmPassword: "password123",
           phoneNumber: "9800000000",
           addressId: "1"
         }
       }
     }
    } */

  /* #swagger.responses[201] = {
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

  registerUser(ROLES.ADMIN),
);

export default router;
