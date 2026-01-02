import { checkSchema, Schema } from "express-validator";
import { loginValidation, registerValidation } from "./auth.validator";

export const searchUserValidation: Schema = {
  username: {
    in: ["query"],
    isString: true,
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Search term cannot be empty",
    },
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: { options: { min: 1, max: 100 } },
    toInt: true,
  },
};

export const updateUserValidation: Schema = {
  ...registerValidation,
  password: {
    ...registerValidation.password,
    optional: true,
  }, // to prevent forceful password field from registerValidatio
  confirm_password: {
    ...registerValidation.confirm_password,
    optional: true,
  }, // to prevent forceful confirm_password field from registerValidation
  username: {
    ...registerValidation.username,
    optional: true,
  },
  email: {
    ...registerValidation.email,
    optional: true,
  },
  new_password: {
    ...registerValidation.password,
    optional: true,
  },
  confirm_new_password: {
    ...registerValidation.confirm_password,
    optional: true,
  },
  phone_number: {
    ...registerValidation.phone_number,
    optional: true,
  },
  role_id: {
    ...registerValidation.role_id,
    optional: true,
  },
  address_id: {
    ...registerValidation.address_id,
    optional: true,
  },
  confirmation_password: {
    ...loginValidation.password
  },
};
