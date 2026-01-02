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
  username: {
    ...registerValidation.username,
    optional: true,
  },
  email: {
    ...registerValidation.email,
    optional: true,
  },
  newPassword: {
    ...registerValidation.password,
    optional: true,
  },
  confirmNewPassword: {
    ...registerValidation.confirmPassword,
    optional: true,
  },
  phoneNumber: {
    ...registerValidation.phoneNumber,
    optional: true,
  },
  roleId: {
    ...registerValidation.roleId,
    optional: true,
  },
  addressId: {
    ...registerValidation.addressId,
    optional: true,
  },
  confirmationPassword: {
    ...loginValidation.password
  },
};

export const deleteUserValidation: Schema = {
  confirmationPassword: {
    ...updateUserValidation.confirmationPassword
  }
}
