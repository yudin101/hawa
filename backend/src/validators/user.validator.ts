import { Schema } from "express-validator";
import { loginSchema, registerSchema } from "./auth.validator";

export const searchUserSchema: Schema = {
  username: {
    in: ["query"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    toLowerCase: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
  },
  page: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Page number must be greater than zero",
    },
    toInt: true,
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "Limit must be an integer between 1 and 100",
    },
    toInt: true,
  },
};

export const updateUserSchema: Schema = {
  id: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "User Id must be a integer",
    },
    trim: true,
  },
  username: {
    ...registerSchema.username,
    optional: true,
  },
  email: {
    ...registerSchema.email,
    optional: true,
  },
  newPassword: {
    ...registerSchema.password,
    optional: true,
  },
  confirmNewPassword: {
    ...registerSchema.confirmPassword,
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (!value && req.body.newPassword) {
          throw new Error("Please confirm your password");
        }

        if (req.body.newPassword && value !== req.body.newPassword.trim()) {
          throw new Error("Password confirmation does not match password");
        }

        return true;
      },
    },
  },
  phoneNumber: {
    ...registerSchema.phoneNumber,
    optional: true,
  },
  addressId: {
    ...registerSchema.addressId,
    optional: true,
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
};

export const changeUserTypeSchema: Schema = {
  confirmationPassword: {
    ...loginSchema.confirmationPassword,
  },
  id: {
    ...updateUserSchema.id,
  },
};

export const deleteUserSchema: Schema = {
  id: {
    ...updateUserSchema.id,
  },
  confirmationPassword: {
    ...loginSchema.confirmationPassword,
  },
};

export const userWithUsernameSchema: Schema = {
  username: {
    ...searchUserSchema,
    in: ["params"],
  },
};
