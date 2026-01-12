import { Schema } from "express-validator";
import { loginSchema, registerSchema } from "./auth.validator";

export const searchUserSchema: Schema = {
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

export const updateUserSchema: Schema = {
  id: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "User Id must be a string",
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
