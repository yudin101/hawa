import { Schema } from "express-validator";
import { loginValidation, registerValidation } from "./auth.validator";

export const searchUserValidation: Schema = {
  username: {
    in: ["query"],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      },
    },
    isString: true,
    trim: true,
    toLowerCase: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Search term is too long",
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
  addressId: {
    ...registerValidation.addressId,
    optional: true,
  },
  confirmationPassword: {
    ...loginValidation.password,
  },
};

export const deleteUserValidation: Schema = {
  confirmationPassword: {
    ...updateUserValidation.confirmationPassword,
  },
};

export const userWithUsernameValidation: Schema = {
  username: {
    in: ["params"],
    isString: true,
    trim: true,
    toLowerCase: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
  },
};
