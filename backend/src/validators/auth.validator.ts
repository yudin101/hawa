import { Schema } from "express-validator";

const NEPALI_MOBILE_REGEX = /^(\+977)?9[6-9]\d{8}$/;

export const registerValidation: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    toLowerCase: true,
    matches: {
      options: /^[a-zA-Z0-9._]+$/,
      errorMessage: "Username can only contain letters, numbers, dots, and underscores."
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email must be a string",
    },
    trim: true,
    normalizeEmail: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Email must be within 100 characters",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters",
    },
  },
  confirmPassword: {
    in: ["body"],
    isString: {
      errorMessage: "Confirmed password must be a string",
    },
    trim: true,
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
  },
  roleId: {
    in: ["body"],
    isString: {
      errorMessage: "Role ID must be a string",
    },
    trim: true,
  },
  addressId: {
    in: ["body"],
    isString: {
      errorMessage: "Address ID must be a string",
    },
    trim: true,
  },
};

export const loginValidation: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    toLowerCase: true,
    isLength: {
      options: {
        max: 50
      },
      errorMessage: "Username must be within 50 characters"
    }
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
  },
};
