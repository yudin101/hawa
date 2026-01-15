import { Schema } from "express-validator";

const NEPALI_MOBILE_REGEX = /^(\+977|977)?\s?9[6-9]\d{8}$/;

export const registerSchema: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
    toLowerCase: true,
    matches: {
      options: /^[a-zA-Z0-9._]+$/,
      errorMessage:
        "Username can only contain letters, numbers, dots, and underscores.",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Email must be within 100 characters",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    isLength: {
      options: { min: 8, max: 72 },
      errorMessage: "Password must be between 8 and 72 characters",
    },
  },
  confirmPassword: {
    in: ["body"],
    isString: {
      errorMessage: "Confirmed password must be a string",
    },
    trim: true,
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password.trim()) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      },
    },
  },
  phoneNumber: {
    in: ["body"],
    isString: {
      errorMessage: "Phone number must be a string",
    },
    trim: true,
    matches: {
      options: [NEPALI_MOBILE_REGEX],
      errorMessage:
        "Invalid Nepali mobile number format. Must be 10 digits (e.g., 98XXXXXXXX) with optional +977 prefix.",
    },
    customSanitizer: {
      options: (value: string) => {
        return value.replace(/^(\+977|977)\s*/, "");
      },
    },
  },
  addressId: {
    in: ["body"],
    isString: {
      errorMessage: "Address ID must be a string",
    },
    trim: true,
  },
};

export const loginSchema: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
    toLowerCase: true,
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
  },
};

export const refreshTokenSchema: Schema = {
  refresh_token: {
    in: ["cookies"],
    exists: {
      errorMessage: "Refresh token is missing",
    },
    isString: {
      errorMessage: "Refresh token must be a string",
    },
    trim: true,
    notEmpty: {
      errorMessage: "Refresh token cannot be empty",
    },
  },
};
